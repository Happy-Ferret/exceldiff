// The boilerplate code below is copied from the Django 1.11 documentation.
// It establishes the necessary HTTP header fields and cookies to use
// Django CSRF protection with jQuery Ajax requests.

$( document ).ready(function() {  // Runs when the document is ready

    // using jQuery
    // https://docs.djangoproject.com/en/1.11/ref/csrf/
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    function sync(tab1, tab2) {
        var syncSelection = function (r, c, r2, c2, selectionLayerLevel) {
            var sel1 = tab1.getSelected();
            var sel2 = tab2.getSelected();
            if (!sel2) {
                tab2.selectCell(r, c, r2, c2);
            }
            if (!sel1) {
                tab1.selectCell(r, c, r2, c2);
            }
        };

        // syncs while selecting (does not work for selecting one cell)
        tab1.addHook('afterSelection', syncSelection);
        // needed to sync selection of one cell
        tab1.addHook('afterSelectionEnd', syncSelection);
        // syncs while selecting (does not work for selecting one cell)
        tab2.addHook('afterSelection', syncSelection);
        //needed to sync selection of one cell
        tab2.addHook('afterSelectionEnd', syncSelection);

    }

    function deleteRenderer(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.background = 'red';
    }

    function insertRenderer(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.background = 'blue';
    }

    function diffRenderer(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.background = 'orange';
    }

    function setRenderer(row, col, prop) {
          console.log(row, col);
          var cellProperties = {};
          if ($.inArray(row, row_delete) >= 0){
              cellProperties.renderer = deleteRenderer;
          }
          else if ($.inArray(col, col_delete) >= 0){
              cellProperties.renderer = deleteRenderer;
          }
          else if ($.inArray(row, row_insert) >= 0){
              cellProperties.renderer = insertRenderer;
          }
          else if ($.inArray(col, col_insert) >= 0){
              cellProperties.renderer = insertRenderer;
          }
          return cellProperties;
    }

    function selectRow(event) {
        event.data.instance.selectCell(event.data.val, 0, event.data.val, event.data.length -1 );
    }

    function selectCol(event) {
        event.data.instance.selectCell(0, event.data.val, event.data.length -1, event.data.val);
    }

    function selectElement(event) {
        event.data.instance.selectCell(event.data.row, event.data.col);
    }

    function setRowClick(instance, row_delete, row_insert, row_header1, row_header2, col_length){

        var rowval = 0;
        var curval = 0;
        for (var i = 0; i < row_delete.length; i++){
             curval = row_delete[i];
            $('#rows').append("<tr><th scope='row'> Delete </th>\n" +
                              "<td><a id='rows"+ rowval +"' href='#'>" +
                               row_header1[curval] +
                               "</a></td></tr>");
            $('#rows' + rowval).on('click', {
                instance: instance,
                val: curval,
                length: col_length
            }, selectRow);
            rowval++;
        }
        for (i = 0; i < row_insert.length; i++){
            curval = row_insert[i];
            $('#rows').append("<tr><th scope='row'> Insert </th>\n" +
                              "<td><a id='rows"+ rowval +"' href='#'>" +
                               row_header2[curval] +
                               "</a></td></tr>");
            $('#rows' + rowval).on('click', {
                instance: instance,
                val: curval,
                length: col_length
            }, selectRow);
            rowval++;
        }
    }

    function setColClick(instance, col_delete, col_insert, col_header1, col_header2, row_length){

        var colval = 0;
        var curval = 0;
        for (var i = 0; i < col_delete.length; i++){
             curval = col_delete[i];
            $('#cols').append("<tr><th scope='row'> Delete </th>\n" +
                              "<td><a id='cols"+ colval +"' href='#'>" +
                               col_header1[curval] +
                               "</a></td></tr>");
            $('#cols' + colval).on('click', {
                instance: instance,
                val: curval,
                length: row_length
            }, selectCol);
            colval++;
        }
        for (i = 0; i < col_insert.length; i++){
            curval = col_insert[i];
            $('#cols').append("<tr><th scope='row'> Insert </th>\n" +
                              "<td><a id='cols"+ colval +"' href='#'>" +
                               col_header2[curval] +
                               "</a></td></tr>");
            $('#cols' + colval).on('click', {
                instance: instance,
                val: curval,
                length: row_length
            }, selectCol);
            colval++;
        }
    }

    function setDiffClick(instance, datadiff, col_header, row_header, data1, data2){
          var eleval = 0;
          for(var i = 0; i < datadiff.length; i++){
              var diffelement = datadiff[i];
              $('#element').append("<tr><th scope='row'> ("  + row_header[diffelement[0]] + "," +
                                col_header[diffelement[1]] + ")" +  "</th>\n" +
                              "<td><a id='element"+ eleval +"' href='#'>" +
                               data1[diffelement[0]][diffelement[1]] + " -> " + data2[diffelement[0]][diffelement[1]] +
                               "</a></td></tr>");
              $('#element' + eleval).on('click', {
                instance: instance,
                row: diffelement[0],
                col: diffelement[1]
              }, selectElement);
              eleval++;
          }
    }


   var container1 = $("#table1");
   var container2 = $("#table2");
   container1.handsontable({
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true
   });
   container2.handsontable({
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true
   });

   $.getJSON("../../media/result.json", function(json) {
        console.log(json);
        var data1 = json["data1"];
        var data2 = json["data2"];
        var instance1 = $("#table1").handsontable('getInstance');
        var instance2 = $("#table2").handsontable('getInstance');
        instance1.loadData(data1);
        instance2.loadData(data2);
        sync(instance1, instance2);
        //instance1.selectCell(2, 4, 3, 5);

        var row_delete = json["row_delete"];
        var col_delete = json["col_delete"];
        var row_insert = json["row_insert"];
        var col_insert = json["col_insert"];
        var datadiff = json["datadiff"];

        var row_header1 = json["row_header1"];
        var col_header1 = json["col_header1"];
        var row_header2 = json["row_header2"];
        var col_header2 = json["col_header2"];

        instance1.updateSettings({
            rowHeaders: row_header1,
            colHeaders: col_header1,
            cells: function (row, col, prop) {
                  var cellProperties = {};
                  if ($.inArray(row, row_delete) >= 0){
                      cellProperties.renderer = deleteRenderer;
                  }
                  else if ($.inArray(col, col_delete) >= 0){
                      cellProperties.renderer = deleteRenderer;
                  }
                  else if ($.inArray(row, row_insert) >= 0){
                      cellProperties.renderer = insertRenderer;
                  }
                  else if ($.inArray(col, col_insert) >= 0){
                      cellProperties.renderer = insertRenderer;
                  }
                  else {
                      for(var i = 0; i < datadiff.length; i++){
                          var diffelement = datadiff[i];
                          //console.log(datadiff[i]);
                          if (row === diffelement[0] && col === diffelement[1]){
                              cellProperties.renderer = diffRenderer;
                          }
                      }
                  }
                  return cellProperties;
            }
        });

       instance2.updateSettings({
           rowHeaders: row_header2,
            colHeaders: col_header2,
            cells: function (row, col, prop) {

                  var cellProperties = {};
                  if ($.inArray(row, row_delete) >= 0){
                      cellProperties.renderer = deleteRenderer;
                  }
                  else if ($.inArray(col, col_delete) >= 0){
                      cellProperties.renderer = deleteRenderer;
                  }
                  else if ($.inArray(row, row_insert) >= 0){
                      cellProperties.renderer = insertRenderer;
                  }
                  else if ($.inArray(col, col_insert) >= 0){
                      cellProperties.renderer = insertRenderer;
                  }
                  else {
                      for(var i = 0; i < datadiff.length; i++){
                          var diffelement = datadiff[i];
                          //console.log(datadiff[i]);
                          if (row === diffelement[0] && col === diffelement[1]){
                              cellProperties.renderer = diffRenderer;
                          }
                      }
                  }
                  return cellProperties;
            }
        });

       setRowClick(instance1, row_delete, row_insert, row_header1, row_header2, col_header1.length);
       setColClick(instance1, col_delete, col_insert, col_header1, col_header2, row_header1.length);
       setDiffClick(instance1, datadiff, col_header1, row_header1, data1, data2)
   });

}); // End of $(document).ready

