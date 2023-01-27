FROM rstudio/plumber

WORKDIR /usr/src/app

# install the linux libraries needed for plumber
RUN apt-get update && apt-get install -y \
    build-essential curl libcurl4-openssl-dev apt-utils libjq-dev systemctl\
    r-base r-base-dev libssl-dev libprotobuf-dev protobuf-compiler\
    libudunits2-dev libproj-dev libgdal-dev libgeos-dev libssl-dev libv8-dev\
    && rm -rf /var/lib/apt/lists/*
RUN apt install -y libprotobuf-dev protobuf-compiler
RUN apt-get upgrade

RUN R -e "install.packages(c('randomForest', 'terra', 'caret', 'raster', 'RCurl', 'tiff', 'sf','plumber','cowplot','tidyterra', 'geojsonR', 'doParallel', 'parallel', 'viridis', 'latticeExtra', 'tmap', 'CAST'))"
RUN R -e "install.packages('plumber', dependencies=TRUE)"
RUN R -e "install.packages('terra', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('caret', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('raster', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('RCurl', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('tiff', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('sf', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('randomForest', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('cowplot', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('tidyterra', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('geojsonR', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('doParallel', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('parallel', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('viridis', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('latticeExtra', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('tmap', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('CAST', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"
RUN R -e "install.packages('s2', dependencies=TRUE, repos='https://cran.uni-muenster.de/')"


# Copy app code source from our local folder into the docker /R working directory
COPY ./backend/plumber.R ./
# open port 7001 to traffic
EXPOSE 8000


CMD ["plumber.R"]