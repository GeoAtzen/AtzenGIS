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
        console.log('File upload successful for sentinel!');
      },
      error: function(err) {
        console.error('File upload failed for sentinel:', err);
      },
      complete: function() {
        $('#puff1').hide();
      }
    });
  });

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
        console.log('File upload successful for trainingsdatashp!');
      },
      error: function(err) {
        console.error('File upload failed for trainingsdatashp:', err);
      },
      complete: function() {
        $('#puff3').hide();
      }
    });
  });

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
        console.log('File upload successful for trainingsdata!');
      },
      error: function(err) {
        console.error('File upload failed for trainingsdata:', err);
      },
      complete: function() {
        $('#puff2').hide();
      }
    });
  });

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
        console.log('File upload successful for model!');
      },
      error: function(err) {
        console.error('File upload failed for model:', err);
      },
      complete: function() {
        $("#puff4").hide();
      }
    });
  });
});