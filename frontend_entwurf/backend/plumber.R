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


######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

# Diese Funktion nimmt Referenzdaten entgegen, die sowohl vom Typ GeoJson,
# Geopackage oder Shapefile schon weiterverarbeitet wurden und trainiert 
# nun mit dem Tif ein Model
trainModel <- function(Referenzdaten){
  #url <- ("http://frontend:3000/usersentineldata.tif")
  #geotiff_file <- tempfile(fileext='.tif')
  #httr::GET(url,httr::write_disk(path=geotiff_file))
  #sentinel <- rast(geotiff_file)

  sentinel <- rast("mydockerdata/usersentineldata.tif")
  predictors <- names(sentinel)
  
  Referenzdaten <- st_transform(Referenzdaten, crs(sentinel))
  extr <- extract(sentinel, Referenzdaten)
  Referenzdaten$PolyID <- 1:nrow(Referenzdaten)
  extr <- merge(extr,Referenzdaten,by.x="ID",by.y="PolyID")
  TrainIDs <- createDataPartition(extr$ID,p=0.05,list=FALSE)
  TrainDat <- extr[TrainIDs,]
  TrainDat <- TrainDat[complete.cases(TrainDat[,predictors]),]
  model <- train(TrainDat[,predictors],
                 TrainDat$Label,
                 method="rf",
                 importance=TRUE,
                 ntree=50)
  
  calculatePrediction(sentinel, model)
}

######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

# Diese Funktion erhält ein Tif und ein trainiertes Modell und kann damit die
# Prediction erstellen, welche dann auf den Server geschrieben wird.
calculatePrediction <- function(sentinel, model){
  prediction <- predict(as(sentinel,"Raster"),model)
  prediction_terra <- as(prediction,"SpatRaster")
  prediction_terra <- setColor(prediction_terra)
  
  crs(prediction_terra) <- "EPSG:32632"
  
  terra::writeRaster(prediction_terra, "mydockerdata/prediction.tif", overwrite = TRUE)

  # Zum schneller machen
  cl <- makeCluster(4) 
  registerDoParallel(cl) 
  
  # Berechnung AOA (dauert sehr lange)
  AOA <- aoa(sentinel,model,cl=cl)

  # Grau ist außerhalb von AOA
  AOAPlot <- AOA$AOA
  cellValue <- c(1, 0)
  colorV <- c("#d3d3d3", rgb(0,0,0,0))
  colorD <- data.frame(cellValue = cellValue, color = colorV)
  coltab(AOAPlot) <- colorD
  plot(AOAPlot)
  crs(AOAPlot) <- "EPSG:32632"
  terra::writeRaster(AOAPlot, "mydockerdata/aoa.tif", overwrite = TRUE)
  print("Fertig mit AOA")

  #DIPlot <- AOA$DI
  #crs(DIPlot) <- "EPSG:32632"
  #writeRaster(DIPlot, "./data/DI.tif", overwrite = TRUE)
  #print("Fertig mit DI")

  DIGanz <- as.polygons(selectHighest(AOA$DI, 2000))
  writeVector(DIGanz, "mydockerdata/samples.shp", overwrite=TRUE)
  

  print("Fertig mit DI Sampling Locations")

}

######################################################################################################################################################################
######################################################################################################################################################################
######################################################################################################################################################################

# Diese Funktion enthält eine prediction und eine Farbpalette. 
# Über Cowplot erhält man hier eine symbolisierte Legende.

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

# Symbolisierung der Prediction

setColor <- function(prediction_terra){
  
  list <- as.data.frame(levels(prediction_terra))
  colors <- c("#000000")
  for(i in 1:nrow(list)){
   
    switch(list[i,2],
           "Acker"={
             colors <- append(colors, "#A0522D")
           },
           "Acker_bepflanzt"={
             colors <- append(colors, "#98FB98")
           },
           "Binnengewaesser"={
             colors <- append(colors, "#7FFFd4")
           },
           "Industrie"={
             colors <- append(colors, "#C0C0C0")
           },
           "Innenstadt"={
             colors <- append(colors, "#F5F5F5")
           },
           "Kunstrasen"={
             colors <- append(colors, "#00FF00")
           },
           "Laubwald"={
             colors <- append(colors, "#228B22")
           },
           "Mischwald"={
             colors <- append(colors, "#006400")
           },
           "Parklandschaft"={
             colors <- append(colors, "#696969")
           },
           "Siedlung"={
             colors <- append(colors, "#B22222")
           },
           "Versiegelt"={
             colors <- append(colors, "#000000")
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

#* Calculates LULC Classification
#* @serializer png
#* @get /tiffgjson
function(ymin=NA, ymax=NA, xmin=NA, xmax=NA){
  
  #maske_raster <- c(xmin, xmax, ymin, ymax)
  #maske_training <- c(xmin=xmin,ymin=ymin,xmax=xmax,ymax=ymax)

  Referenzdaten <- st_read("mydockerdata/usertrainingspolygonegjson.geojson")
  trainModel(Referenzdaten)
}

#* Calculates LULC Classification
#* @serializer png
#* @get /tiffgpkg
function(ymin=NA, ymax=NA, xmin=NA, xmax=NA){

  #maske_raster <- c(xmin, xmax, ymin, ymax)
  #maske_training <- c(xmin=xmin,ymin=ymin,xmax=xmax,ymax=ymax)

  Referenzdaten <- st_read("mydockerdata/usertrainingspolygonegpkg.gpkg")
  trainModel(Referenzdaten)
}

#* Calculates LULC Classification
#* @serializer png
#* @get /tiffshape
function(ymin=NA, ymax=NA, xmin=NA, xmax=NA){
  download.file("http://frontend:3000/mydockerdata/usertrainingsdatashp.zip", destfile = "Classification.zip")
  system("unzip Classification.zip")

  #maske_raster <- c(xmin, xmax, ymin, ymax)
  #maske_training <- c(xmin=xmin,ymin=ymin,xmax=xmax,ymax=ymax)


  Referenzdaten <- st_read("usertrainingspolygoneshp.shp")
  trainModel(Referenzdaten)
}

#* Calculates LULC Classification
#* @serializer png
#* @get /tiffmodel
function(ymin=NA, ymax=NA, xmin=NA, xmax=NA){
  
  print(ymin)
  #maske_raster <- c(xmin, xmax, ymin, ymax)
  #maske_training <- c(xmin=xmin,ymin=ymin,xmax=xmax,ymax=ymax)

  sentinel <- rast("mydockerdata/usersentineldata.tif")
  model <- readRDS("mydockerdata/usertrainedmodel.rds")
  
  calculatePrediction(sentinel, model)
}

# Programmatically alter your API
#* @plumber
function(pr) {
  pr %>%
    # Overwrite the default serializer to return unboxed JSON
    pr_set_serializer(serializer_unboxed_json())
}

#* Merges two geojsons
#* @serializer geojson
#* @get /merge_files
#merge_files(INPUT_FOLDER = "../uploads/", OUTPUT_FILE = "merged_file.geojson")
