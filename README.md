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
1. Docker Desktop starten
<br>2. Dieses Repository klonen!
<br>3. In VSC im Terminal in den Ordner AtzenGIS navigieren
<br>3. $ docker-compose up
<br>Die Website ist dann erreichbar unter:
<br>http://localhost:3000/
<br>
<h5>Attention!</h5>
<br>First Loading Session will take some time!


<h3>Step 1</h3>
WebApp öffnen und zum AtzenGIS navigieren
<img width="1600" alt="step1" src="https://github.com/GeoAtzen/AtzenGIS/blob/main/AtzenGIS/public/stylesheets/1_readme.jpeg">


<h3>Step 2</h3>
Auf der Anwedungsseite Auswählen, ob ein trainiertes Modell vorhanden ist oder nicht
<img width="1600" alt="step2" src="https://raw.githubusercontent.com/GeoAtzen/AtzenGIS/main/AtzenGIS/public/images/2_readme.jpeg">

<h3>Step 3.1</h3>
Hochladen der Daten und optinal auswählen einer area of interest
<img width="1600" alt="step31" src="https://raw.githubusercontent.com/GeoAtzen/AtzenGIS/main/AtzenGIS/public/images/3_1_readme.jpeg?token=GHSAT0AAAAAAB4DNRABUVS22R4BWLZVSFHWY6ZR6ZA">

<h3>Step 3.2</h3>
Hochladen der Daten und optinal auswählen einer Area of Interest und einem Trainingsalgorithmus zum trainieren der hochgeladenen Trainingsdaten
<img width="1600" alt="step32" src="https://raw.githubusercontent.com/GeoAtzen/AtzenGIS/main/AtzenGIS/public/images/3_2_readme.jpeg?token=GHSAT0AAAAAAB4DNRABPEWNR5BTHCRH6GX2Y6ZR7SA">

<h3>Step 4</h3>
Anzeigen der Prediction auf Knopfdruck mit Legende
<img width="1600" alt="step4" src="https://raw.githubusercontent.com/GeoAtzen/AtzenGIS/main/AtzenGIS/public/images/4_readme.jpeg?token=GHSAT0AAAAAAB4DNRAAAGGVDRWREGMKXILCY6ZSAJA">

<h3>Step 5</h3>
Anzeigen der AOA mit Informationstext und den sampling locations
<img width="1600" alt="step4" src="https://raw.githubusercontent.com/GeoAtzen/AtzenGIS/main/AtzenGIS/public/images/5_readme.jpeg?token=GHSAT0AAAAAAB4DNRAADNK64FEK3Q6JEPD4Y6ZSBIA">


<h3>Step 6</h3>
Digitalisieren und Labeln neuer Trainingsdaten mit der Möglichkeit diese noch schriftlich anzupassen, mit dem bereits hochgeladenen GeoPackage oder GeoJSON zu verbinden und dann herunterzuladen.
<img width="1600" alt="step4" src="https://raw.githubusercontent.com/GeoAtzen/AtzenGIS/main/AtzenGIS/public/images/6_readme.jpeg?token=GHSAT0AAAAAAB4DNRABVBWEYHJPAPUM2PMCY6ZSCZA">

<h3>Step 7</h3>
Download aller einzelnen Daten und auf Knopfdruck zurück zu Anwendungsseite um dort mit der gemergten Datei einen erneuten Durchlauf zu starten
<img width="1600" alt="step4" src="https://raw.githubusercontent.com/GeoAtzen/AtzenGIS/main/AtzenGIS/public/images/7_readme.jpeg?token=GHSAT0AAAAAAB4DNRAADYEMXAEJKGPD5724Y6ZSDNQ">


<h2>License</h2>
Dieses Programm ist eine freie, opensource Software: Sie können es unter den Bedingungen der GNU General Public License, wie von der Free Software Foundation veröffentlicht, weitergeben und/oder verändern.
Weitere Informationen über die Lizenz finden Sie unter <a href="https://github.com/GeoAtzen/AtzenGIS/blob/main/LICENCE">LICENSE</a>.

<h2>Acknowledgments</h2>
Dieses Programm wurde von Jonathan M., Darian W., Luca H., Tobias K., Tim L. und Erkam D. für die Veranstaltung Geosoftware II unter der Leitung von E. Pebesma und C. Knoth erstellt.

