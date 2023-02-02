'use strict';

/**
 * L.Shapefile is a subclass of L.GeoJSON, which is used to load and parse Shapefile data.
 * @class L.Shapefile
 * @extends L.GeoJSON
 * @param {string|ArrayBuffer} file - The shapefile data to be loaded.
 * @param {Object} options - The options object for this instance.
 * @fires data:loading - Fires when data is being loaded.
 * @fires data:loaded - Fires when data has been loaded and added to the instance.
 * @fires data:error - Fires when there is an error loading the data. 
 */
L.Shapefile = L.GeoJSON.extend({
  options: {
    importUrl: 'shp.js'
  },

  initialize: function(file, options) {
    L.Util.setOptions(this, options);
    if (typeof cw !== 'undefined') {
      /*eslint-disable no-new-func*/
      if (!options.isArrayBuffer) {
        this.worker = cw(new Function('data', 'cb', 'importScripts("' + this.options.importUrl + '");shp(data).then(cb);'));
      } else {
        this.worker = cw(new Function('data', 'importScripts("' + this.options.importUrl + '"); return shp.parseZip(data);'));
      }
      /*eslint-enable no-new-func*/
    }
    L.GeoJSON.prototype.initialize.call(this, {
      features: []
    }, options);
    this.addFileData(file);
  },

  addFileData: function(file) {
    var self = this;
    this.fire('data:loading');
    if (typeof file !== 'string' && !('byteLength' in file)) {
      var data = this.addData(file);
      this.fire('data:loaded');
      return data;
    }
    if (!this.worker) {
      shp(file).then(function(data) {
        self.addData(data);
        self.fire('data:loaded');
      }).catch(function(err) {
        self.fire('data:error', err);
      })
      return this;
    }
    var promise;
    if (this.options.isArrayBufer) {
      promise = this.worker.data(file, [file]);
    } else {
      promise = this.worker.data(cw.makeUrl(file));
    }

    promise.then(function(data) {
      self.addData(data);
      self.fire('data:loaded');
      self.worker.close();
    }).then(function() {}, function(err) {
      self.fire('data:error', err);
    })
    return this;
  }
});

/**
 * Adds the Shapefile data to the instance.
 * @function
 * @param {string|ArrayBuffer} file - The shapefile data to be added.
 * @return {L.Shapefile}
 */
L.shapefile = function(a, b, c) {
  return new L.Shapefile(a, b, c);
};
