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


<h2>License</h2>
Dieses Programm ist eine freie, OPENSOURCE Software: Sie können es unter den Bedingungen der GNU General Public License, wie von der Free Software Foundation veröffentlicht, weitergeben und/oder verändern.
Weitere Informationen über die Lizenz finden Sie unter LICENSE.

<h2>Acknowledgments</h2>
Dieses Programm wurde von Johnathan M., Darian W., Luca H., Tobias K., Tim L. und Erkam D. für die Veranstaltung Geosoftware II unter der Leitung von E. Pebesma und C. Knoth erstellt.
