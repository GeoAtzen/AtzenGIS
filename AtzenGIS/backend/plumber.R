rm(list=ls())
library(plumber)
library(terra)
library(caret)
library(raster)
library(RCurl)
library(tiff)
library(sf)
library(randomForest)
library(cowplot)
library(tidyterra)
library(geojsonR)
library(doParallel)
library(parallel)
library(viridis)
library(latticeExtra)
library(tmap)
library(CAST)
library(s2)

######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

#* Convertes uploaded geopackage by user to geojson
#* @serializer geojson
#* @get /gpkgtogjson
function(){
Referenzdaten <- st_read("mydockerdata/usertrainingspolygonegpkg.gpkg")

  convert <- st_read("mydockerdata/usertrainingspolygonegpkg.gpkg")
  st_write(convert, "mydockerdata/usertrainingspolygonegpkg.geojson", append=FALSE)
  convertedgpkg <- st_read("mydockerdata/usertrainingspolygonegpkg.geojson")
}

######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

# This function accepts reference data that is of type GeoJson,
# Geopackage or Shapefile and trains a model with the Tif. 
# now with the Tif a model
trainModel <- function(Referenzdaten, sentinel, alg){
  
  predictors <- names(sentinel)
  
  Referenzdaten <- st_transform(Referenzdaten, crs(sentinel))
  extr <- extract(sentinel, Referenzdaten)
  Referenzdaten$PolyID <- 1:nrow(Referenzdaten)
  extr <- merge(extr,Referenzdaten,by.x="ID",by.y="PolyID")
  TrainIDs <- createDataPartition(extr$ID,p=0.05,list=FALSE)
  TrainDat <- extr[TrainIDs,]
  TrainDat <- TrainDat[complete.cases(TrainDat[,predictors]),]

   if(is.na(alg)) alg <- "rf"
   
  if(alg == "rf") {
    model <- train(TrainDat[,predictors],
                   TrainDat$Label,
                   method="rf",
                   importance=TRUE,
                   ntree=50)
  } else if(alg == "svm") {
    model <- train(TrainDat[,predictors],
                   TrainDat$Label,
                   method="svmRadial",
                   tuneLength = 10)
  } else if(alg == "dt") {
    model <- train(TrainDat[,predictors],
                   TrainDat$Label,
                   method="rpart")
  } else if(alg == "knn") {
    model <- train(TrainDat[,predictors],
                   TrainDat$Label,
                   method="knn",
                   preProcess = c("center", "scale"),
                   tuneLength = 10)
  } else {
    model <- train(TrainDat[,predictors],
                   TrainDat$Label,
                   method="rf",
                   importance=TRUE,
                   ntree=50)
  }
  calculatePrediction(sentinel, model)
}

######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

# This function receives a Tif and a trained model and can use it to # create the prediction, which is then written to the server.
# Prediction, which is then written to the server.
calculatePrediction <- function(sentinel, model){
  # Make the prediction
  prediction <- predict(as(sentinel,"Raster"),model)
  prediction_terra <- as(prediction,"SpatRaster")
  prediction_terra <- setColor(prediction_terra)
  
  crs(prediction_terra) <- "EPSG:32632"
  terra::writeRaster(prediction_terra, "mydockerdata/prediction.tif", overwrite = TRUE)

  # for faster computation
  cl <- makeCluster(4) 
  registerDoParallel(cl) 
  
  AOA <- aoa(sentinel,model,cl=cl)

  AOAPlot <- AOA$AOA
  cellValue <- c(1, 0)
  colorV <- c("#ffec8b", "#8a2be2")
  colorD <- data.frame(cellValue = cellValue, color = colorV)
  coltab(AOAPlot) <- colorD
  plot(AOAPlot)
  crs(AOAPlot) <- "EPSG:32632"

  terra::writeRaster(AOAPlot, "mydockerdata/aoa.tif", overwrite = TRUE)


  DIGanz <- as.polygons(selectHighest(AOA$DI, 2000))
  writeVector(DIGanz, "mydockerdata/samples.shp", overwrite=TRUE)
  
}

######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

# This function contains a prediction and a color palette. 
# About Cowplot one receives here a symbolized legend.

getLegend <- function(prediction_terra, colors){
  
  colors <- colors[-1]
  
  legendPlot <- ggplot()+
    geom_spatraster(data=prediction_terra)+
    scale_fill_manual(values = colors)
  
  Legend <- get_legend(legendPlot)
  
  png(filename="mydockerdata/predictionlegende.png")
  plot(Legend)
  dev.off()
  
}

######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

# Symbolisierung of the prediction

setColor <- function(prediction_terra){
  
  list <- as.data.frame(levels(prediction_terra))
  colors <- c("#000000")
  for(i in 1:nrow(list)){
   
    switch(list[i,2],
           "Acker"={
             colors <- append(colors, "#d18b2c")
           },
           "Acker_bepflanzt"={
             colors <- append(colors, "#70843a")
           },
           "Bahnschiene"={
             colors <- append(colors, "#613232")
           },
           "Baumgruppe"={
             colors <- append(colors, "#18471e")
           },
           "Binnengewaesser"={
             colors <- append(colors, "#0a1cb1")
           },
           "Industrie"={
             colors <- append(colors, "#696969")
           },
           "Innenstadt"={
             colors <- append(colors, "#F5F5F5")
           },
           "Kunstrasen"={
             colors <- append(colors, "#92e597")
           },
           "Laubwald"={
             colors <- append(colors, "#03ad1d")
           },
           "Mischwald"={
             colors <- append(colors, "#11671e")
           },
           "Parklandschaft"={
             colors <- append(colors, "#92e597")
           },
           "Siedlung"={
             colors <- append(colors, "#B22222")
           },
           "Strand"={
             colors <- append(colors, "#ffff00")
           },
           "Versiegelt"={
             colors <- append(colors, "#141414")
           },
           "Wiese"={
             colors <- append(colors, "#00FF00")
           },
           colors <- append(colors, "#000000") 
    )
  }
  coltab(prediction_terra) <- colors
  getLegend(prediction_terra, colors)
  return(prediction_terra)
}

######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

#* Calculates LULC Classification and cuts the data if aoi given
#* @serializer png
#* @get /tiffgjson
function(ymin=NA, ymax=NA, xmin=NA, xmax=NA, alg=NA){
  
  sentinel <- rast("mydockerdata/usersentineldata.tif")
  
  # checks if a merged file exists and if so it uses it forst for iterative process
  if (file.exists("mydockerdata/mergedgeojsonfile.geojson")) {
    print("merged")
    Referenzdaten <- st_read("mydockerdata/mergedgeojsonfile.geojson")
  } else if (file.exists("mydockerdata/usertrainingspolygonegjson.geojson")) {
    print("geojson")
    Referenzdaten <- st_read("mydockerdata/usertrainingspolygonegjson.geojson")
  } else if (file.exists("mydockerdata/usertrainingspolygonegpkg.geojson")) {
    print("gpkg")
    Referenzdaten <- st_read("mydockerdata/usertrainingspolygonegpkg.geojson")
  }
  else {
    stop("Neither mydockerdata/usertrainingspolygonegjson.geojson nor mydockerdata/usertrainingspolygonegpkg.geojson nor mydockerdata/usertrainingspolygonegpkg.geojson exists")
  }

  print(Referenzdaten)
  # for trainingspolygons
  trainingsdataaoi <- c(xmin=xmin,ymin=ymin,xmax=xmax,ymax=ymax)
  print(trainingsdataaoi)
  class(trainingsdataaoi) <- "numeric"

  # Cut data to aoi
  if(!(is.na(ymin) || is.na(ymax) || is.na(xmin) || is.na(xmax))){
    # für Sentinel data
    v <- c(xmin, xmax, ymin, ymax)
    class(v) <- "numeric"
    e <- extent(v)
    rastercordaoi <- as(e,'SpatialPolygons')  
    proj4string(rastercordaoi) <- CRS("+proj=longlat")
    rastercord.UTM <- spTransform(rastercordaoi, CRS("+init=epsg:32632"))
    sentinel <- crop(sentinel, extent(rastercord.UTM))
    sf_use_s2(FALSE)
    validdata <- st_make_valid(Referenzdaten)
    Referenzdaten <- st_crop(validdata, trainingsdataaoi)
  }

  trainModel(Referenzdaten, sentinel, alg)
}


#* Calculates LULC Classification and cuts the data if aoi given
#* @serializer png
#* @get /tiffgpkg
function(ymin=NA, ymax=NA, xmin=NA, xmax=NA, alg=NA){

  sentinel <- rast("mydockerdata/usersentineldata.tif")
  Referenzdaten <- st_read("mydockerdata/usertrainingspolygonegpkg.gpkg")

  # for trainingspolygons
  trainingsdataaoi <- c(xmin=xmin,ymin=ymin,xmax=xmax,ymax=ymax)
  class(trainingsdataaoi) <- "numeric"
  
  # Cut data to aoi
  if(!(is.na(ymin) || is.na(ymax) || is.na(xmin) || is.na(xmax))){
    # for sentinel data
    v <- c(xmin, xmax, ymin, ymax)
    class(v) <- "numeric"
    e <- extent(v)
    rastercordaoi <- as(e,'SpatialPolygons')  
    proj4string(rastercordaoi) <- CRS("+proj=longlat")
    rastercord.UTM <- spTransform(rastercordaoi, CRS("+init=epsg:32632"))
    sentinel <- crop(sentinel, extent(rastercord.UTM))
    
    sf_use_s2(FALSE)
    validdata <- st_make_valid(Referenzdaten)
    Referenzdaten <- st_crop(validdata, trainingsdataaoi)
  }

  trainModel(Referenzdaten, sentinel, alg)
}

#* Calculates LULC Classification and cuts the data if aoi given
#* @serializer png
#* @get /tiffshape
function(ymin=NA, ymax=NA, xmin=NA, xmax=NA, alg=NA){
  sentinel <- rast("mydockerdata/usersentineldata.tif")
  download.file("http://frontend:3000/usertrainingsdatashp.zip", destfile = "usertrainingsdatashp.zip")
  system("unzip usertrainingsdatashp.zip")
  Referenzdaten <- st_read("usertrainingspolygoneshp.shp")

  # for trainingspolygons
  trainingsdataaoi <- c(xmin=xmin,ymin=ymin,xmax=xmax,ymax=ymax)
  class(trainingsdataaoi) <- "numeric"
  

  if(!(is.na(ymin) || is.na(ymax) || is.na(xmin) || is.na(xmax))){
    # for sentinel data
    v <- c(xmin, xmax, ymin, ymax)
    class(v) <- "numeric"
    e <- extent(v)
    rastercordaoi <- as(e,'SpatialPolygons')  
    proj4string(rastercordaoi) <- CRS("+proj=longlat")
    rastercord.UTM <- spTransform(rastercordaoi, CRS("+init=epsg:32632"))
    sentinel <- crop(sentinel, extent(rastercord.UTM))
    
    sf_use_s2(FALSE)
    validdata <- st_make_valid(Referenzdaten)
    
    Referenzdaten <- st_crop(validdata, rastercord.UTM)
  }

  trainModel(Referenzdaten, sentinel, alg)
}

#* Calculates LULC Classification and cuts the data if aoi given
#* @serializer png
#* @get /tiffmodel
function(ymin=NA, ymax=NA, xmin=NA, xmax=NA){

  sentinel <- rast("mydockerdata/usersentineldata.tif")
  model <- readRDS("mydockerdata/usertrainedmodel.rds")

  if(!(is.na(ymin) || is.na(ymax) || is.na(xmin) || is.na(xmax))){
    # for sentinel data
    v <- c(xmin, xmax, ymin, ymax)
    class(v) <- "numeric"
    e <- extent(v)
    rastercordaoi <- as(e,'SpatialPolygons')  
    proj4string(rastercordaoi) <- CRS("+proj=longlat")
    rastercord.UTM <- spTransform(rastercordaoi, CRS("+init=epsg:32632"))
    sentinel <- crop(sentinel, extent(rastercord.UTM))
  }

  calculatePrediction(sentinel, model)
}

# Programmatically alter your API
#* @plumber
function(pr) {
  pr %>%
    # Overwrite the default serializer to return unboxed JSON
    pr_set_serializer(serializer_unboxed_json())
}
