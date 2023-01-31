# Area of Application by GeoAtzen
A Tool to calculate the Area of Applicability (Initial Paper by Meyer, H. and Pebesma, E.)
<h2>Background</h2>
Methoden des maschinellen Lernens werden immer mehr und mehr für räumliche Vorhersagen, wie etwa Klassifizerung und Fernerkundung, verwendet. Einer der Gründe hierfür ist u.a. die Fähigkeit hier nicht-lineare Beziehungen zu erlernen und dadurch Klassifizierungssaufgaben zu lösen.
<br>Ein Problem hierbei ist jedoch, dass diese Algorithmen lediglich aussagekräftige Vorhersagen treffen können, wenn sie auf Daten angewendet werden, die den Ursprungsdaten ähnlich sind, auf denen Sie trainiert wurden. Um diese "Ähnlichkeiten" zu quantifizieren und darzustellen wurde die AOA (Meyer und Pebesma, 2021) entwickelt.


<h2>Project Goals</h2>
Die Methoden zur Berechnung der AOA sind derzeit als Teil des R-Packets CAST verfügbar. Ziel dieses Projektes ist es, genau diese Funktionalität für größere Nutzergruppen verfügbar zu stellen und diese zurm Standardwerkzeug zur Einschätzung der Anwendbarkeit zu integrieren.
<br>Das entwickelte System kombiniert Vorhersagen und Anwendbarkeitsabschätzung basieren auf zwei Betriebsmodelle:
[1]Der Benutzer legt ein trainiertes Modell vor und wählt einen Bereich von Interesse aus: Das System
führt die Klassifizierung in dem betreffenden Gebiet durch und berechnet die AOA.
[2]Der Benutzer gibt ein (trainiertes oder untrainiertes) Modell und Trainingsdaten ein und wählt
Das System führt das Training und die Klassifizierung in dem betreffenden Gebiet durch
Bereich von Interesse durch und berechnet die AOA.


<br>
<h2> Getting Started</h2>
Zur vereinfachten Nutzung haben wir Docker verwendet & bereitgestellt.


<h3>Docker</h3>
<br>1. Docker Desktop starten
<br>2. Dieses Repository klonen!
<br>3. In VSC im Terminal in den Ordner AtzenGIS navigieren
<br>3. $ docker-compose up
<br>Die Website ist dann erreichbar unter:
<br>http://localhost:3000/
<br>
<h5>Attention!</h5>
<br>First Loading Session will take some time!


<h3>Step 1</h3>
<br>WebApp öffnen und zum AtzenGIS navigieren
![1_readme](https://user-images.githubusercontent.com/86024844/215885548-c488dde2-ff5e-4fc4-b952-d5cfa650414a.jpeg)

<h3>Step 2</h3>
<br>Auf der Anwedungsseite Auswählen, ob ein trainiertes Modell vorhanden ist oder nicht
![2_readme](https://user-images.githubusercontent.com/86024844/215885649-dafe49d8-51ad-4914-89e6-497881fe0b76.jpeg)

<h3>Step 3.1</h3>
<br>Hochladen der Daten und optinal auswählen einer area of interest
![3_1_readme](https://user-images.githubusercontent.com/86024844/215885773-13fb5ed3-4f98-4243-aa96-98429768bc7b.jpeg)

<h3>Step 3.2</h3>
<br>Hochladen der Daten und optinal auswählen einer Area of Interest und einem Trainingsalgorithmus zum trainieren der hochgeladenen Trainingsdaten
![3_2_readme](https://user-images.githubusercontent.com/86024844/215885923-2a149983-bdd1-48b3-aef1-51839ee5d964.jpeg)

<h3>Step 4</h3>
<br>Anzeigen der Prediction auf Knopfdruck mit Legende
![4_readme](https://user-images.githubusercontent.com/86024844/215885997-d3f77ac2-4d24-4e6c-85ed-1527085c4453.jpeg)

<h3>Step 5</h3>
<br>Anzeigen der AOA mit Informationstext und den sampling locations
![5_readme](https://user-images.githubusercontent.com/86024844/215886195-46132c47-0ac9-477b-8228-4c18e9be33e0.jpeg)

<h3>Step 6</h3>
<br>Digitalisieren und Labeln neuer Trainingsdaten mit der Möglichkeit diese noch schriftlich anzupassen, mit dem bereits hochgeladenen GeoPackage oder GeoJSON zu verbinden und dann herunterzuladen.
![6_readme](https://user-images.githubusercontent.com/86024844/215886253-d4c3e9bc-2620-458d-a995-cb71d96ac95a.jpeg)

<h3>Step 7</h3>
<br>Download aller einzelnen Daten und auf Knopfdruck zurück zu Anwendungsseite um dort mit der gemergten Datei einen erneuten Durchlauf zu starten
![7_readme](https://user-images.githubusercontent.com/86024844/215886344-150dbd87-80dc-442c-884a-23059183e4fe.jpeg)



<h2>License</h2>
Dieses Programm ist eine freie, OPENSOURCE Software: Sie können es unter den Bedingungen der GNU General Public License, wie von der Free Software Foundation veröffentlicht, weitergeben und/oder verändern.
Weitere Informationen über die Lizenz finden Sie unter LICENSE.

<h2>Acknowledgments</h2>
Dieses Programm wurde von Johnathan M., Darian W., Luca H., Tobias K., Tim L. und Erkam D. für die Veranstaltung Geosoftware II unter der Leitung von E. Pebesma und C. Knoth erstellt.




