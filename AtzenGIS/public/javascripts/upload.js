/**
   * Handles file upload to "/uploadsentinel" route.
   * Shows a loading spinner and alerts the user of the upload status.
   */
$(function() {
  $('form[action="/uploadsentinel"]').submit(function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    $.ajax({
      type: 'POST',
      url: '/uploadsentinel',
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function() {
        $('#puff1').show();
      },
      success: function(data) {
        alert("Hochladen des Sentinel Bildes erfolgreich!")
        console.log('File upload successful for sentinel!');
      },
      error: function(err) {
        alert("Hochladen des Sentinel Bildes fehlgeschlagen!")
        console.error('File upload failed for sentinel:', err);
      },
      complete: function() {
        $('#puff1').hide();
      }
    });
  });

/**
    * Handles file upload to "/uploadtrainingsdatashp" route.
    * Shows a loading spinner and alerts the user of the upload status.
    */
  $('form[action="/uploadtrainingsdatashp"]').submit(function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    $.ajax({
      type: 'POST',
      url: '/uploadtrainingsdatashp',
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function() {
        $('#puff3').show();
      },
      success: function(data) {
        alert("Hochladen der Shapefile erfolgreich!")
        console.log('File upload successful for trainingsdatashp!');
      },
      error: function(err) {
        alert("Hochladen der Shapefile fehlgeschlagen!")
        console.error('File upload failed for trainingsdatashp:', err);
      },
      complete: function() {
        $('#puff3').hide();
      }
    });
  });

/**
   * Handles file upload to "/uploadtrainingsdata" route.
   * Shows a loading spinner and alerts the user of the upload status.
   */
  $('form[action="/uploadtrainingsdata"]').submit(function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    $.ajax({
      type: 'POST',
      url: '/uploadtrainingsdata',
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function() {
        $('#puff2').show();
      },
      success: function(data) {
        alert("Hochladen erfolgreich!")
        console.log('File upload successful for trainingsdata!');
      },
      error: function(err) {
        alert("Hochladen Fehlgeschlagen!")
        console.error('File upload failed for trainingsdata:', err);
      },
      complete: function() {
        $('#puff2').hide();
      }
    });
  });

/**
   * Handles file upload to "/uploadmodel" route.
   * Shows a loading spinner and alerts the user of the upload status.
   */
  $('form[action="/uploadmodel"]').submit(function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    $.ajax({
      type: 'POST',
      url: '/uploadmodel',
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function() {
        $('#puff4').show();
      },
      success: function(data) {
        alert("Hochladen des Models erfolgreich!")
        console.log('File upload successful for model!');
      },
      error: function(err) {
        alert("Hochladen des Models fehlgeschlagen!")
        console.error('File upload failed for model:', err);
      },
      complete: function() {
        $("#puff4").hide();
      }
    });
  });
});

/*
function submitForm(event) { 
  event.preventDefault();
  const form = event.target.form;
  const btn = event.target;

  // Show loading spinner
  const spinner = document.querySelector("#puff4");
  spinner.style.display = "block";

  // Submit the form
  const xhr = new XMLHttpRequest();
  xhr.open(form.method, form.action, true);
  xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      btn.textContent = "Hinzufügen erfolgreich";
    } else if (xhr.readyState === XMLHttpRequest.DONE) {
      btn.textContent = "Fehler beim Hinzufügen";
    }
  };
  xhr.send(new FormData(form));
}

function handleSubmitResponse(element) {
  event.preventDefault();

  // Show loading spinner
  const spinner = document.querySelector("#puff1");
  spinner.style.display = "block";
  
  const btn = element;

  // Submit the form
  const form = element.closest("form");
  const xhr = new XMLHttpRequest();
  xhr.open(form.method, form.action, true);
  xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      spinner.style.display = "none";
      if (xhr.status === 200) {
        btn.textContent = "Hinzufügen erfolgreich";
      } else {
        btn.textContent = "Fehler beim Hinzufügen";
      }
    }
  };
  xhr.send(new FormData(form));
}
*/