# Area of Application by GeoAtzen
A Tool to calculate the Area of Applicability (Initial Paper by Meyer, H. and Pebesma, E.)
<h2>Background</h2>
Machine learning methods have become very popular means for spatial prediction
efforts such as classifying remote sensing images. One reason is their ability to
learn non-linear relationships and thereby solve more complex classifications tasks.
A (sometimes underestimated) issue is that machine learning algorithms can only
provide meaningful predictions (e.g., the land use / land cover class represented by
a pixel of a remote sensing image) when applied to data that is similar to the data
they were trained on (Meyer and Pebesma, 2021). ”Similar” here refers to the value
ranges of the predictor variables (such as different bands of the remote sensing image).
When applying a trained machine learning algorithm to a new geographic area, it is
unclear whether or not the pixels properties in that area are similar enough to the
training data to enable a reliable classification.

<h2> Short Introduction into the Area of Applicability (AOA) </h2>
The Area of Applicability is a method developed by Meyer and Pebesma (2021)
to delineate areas in spatial data (here remote sensing images) that can be assumed
to be areas the machine learning model can reliably be applied to, in our case to
perform land use/land cover (LULC) classification. Besides delineating such an area
of applicability (AOA), this tool can also be used to point to areas where collecting
additional training data is needed to train a more applicable model.

<h2>Project Goals</h2>
The methods for computing the AOA are currently available as part of the R package CAST. The aim of this project is to make this functionality available to larger
user groups and directly integrate it into machine learning-based image classification
workflows as a standard applicability estimation tool. The system to be developed
combines training, prediction (here LULC classes) and applicability estimation, and
supports two modes of operation:

⋅⋅* the user submits a trained model and selects an area of interest: the system
performs the classification in the area of interest and computes the AOA
⋅⋅*the user submits a (trained or untrained) model and training data and selects
an area of interest: the system performs the training, the classification in the
area of interest and computes the AOA

<h2> Getting Started</h2>
We used Docker to ensure an easy deployment.


<h3>Docker</h3>
<br>1. Start Docker Desktop
<br>2. Clone this repository
<br>3. Open the AtzenGIS folder in the Terminal of your IDE (we used VSC)
<br>3. $ docker-compose up
<br>Die Website ist dann erreichbar unter:
<br>http://localhost:3000/
<br>
<h4>Attention!</h4>
<br>Beim ersten Mal dauert das aber ewig, danach gehts immer direkt da alles gecached wird!

<h2>Prerequisites</h2>

<h2>Usage</h2>

<h2>License</h2>
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation.
Refer to [placeholder](placeholder) for more, specific information regarding the License

<h2>Acknowledgments</h2>
This Software was made by Johnathan M., Darian W., Luca H., Tobias K., Tim L. and Erkam D. for the Geosoftware II class led by E. Pebesma and C. Knoth.
