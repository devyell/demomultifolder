var appController = angular.module('miClaroController', []);

appController.controller("mycontroller", function($scope, $http, $httpParamSerializer, $timeout, $localStorage, $location, managerservice, FileSaver) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mostrarListaSec = false;
    $scope.mostrarSinSec = false;
    $scope.mostrarSinSecPop = false;
    $scope.loader = false;
    $scope.errorPop = false;
    $scope.errorlistaSec = false;
    $scope.mostartAceptarSec = false;
    $scope.listaDocuments = false;
    $scope.sinDocuments = false;
    $scope.errorListaDocumeto = false;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion03;


    $scope.closePopUp = function() {
        $(".popup").fadeOut();
        $scope.errorPop = false;
        $scope.mostrarListaDocs = false;
        $scope.listaDocuments = false;
        $scope.sinDocuments = false;
        $scope.errorListaDocumeto = false;
    }

    managerservice.getObtenerDatosUsuarioSesion().then(function(response) {

        var idRespuestaUsuario = response.data.comunResponseType.defaultServiceResponse.idRespuesta;

        if (idRespuestaUsuario == '0') {

            var tipoDocumento = response.data.comunResponseType.tipoDocumento;

            if (tipoDocumento == '001') {
                $scope.obtenerListaSec();
            } else {
                window.location.replace("/wps/myportal/cuentasclaro/root/");
            }
        }

    }, function(response) {

    });

    $scope.obtenerListaSec = function() {

        var obtenerSecRequest = {
            pagina: 0,
            cantResultadosPagina: 0
        };

        var serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerSecRequest) });
        managerservice.obtenerListaSec(serviciosRequest).then(function(response) {
            var idRespuestaSec = response.data.obtenerListadoSECPendientesResponse.defaultServiceResponse.idRespuesta;

            if (idRespuestaSec == '0') {

                $scope.listaSec = response.data.obtenerListadoSECPendientesResponse.listaSec.sec;

                if (!Array.isArray($scope.listaSec)) {
                    $scope.listaSec = [];
                    $scope.listaSec.push(response.data.obtenerListadoSECPendientesResponse.listaSec.sec);
                }

                $scope.mostrarListaSec = true;

            } else if (idRespuestaSec == '1') {
                $(".popup").fadeIn();
                $scope.loader = false;
                $scope.mostrarSinSec = true;
                $scope.mostrarSinSecPop = true;
            } else {
                $scope.errorListaSec = true;
            }

        });

    };

    $scope.aprobarSec = function(listaSecAprovar) {
        $scope.loader = true;
        $(".popup").fadeIn();

        var actualizarSec = {
            numeroSEC: listaSecAprovar.numeroSEC,
            tipoOperacion: "03"
        }

        var actualizarSecRequest = $httpParamSerializer({ requestJson: angular.toJson(actualizarSec) });
        managerservice.actualizaEstadoSec(actualizarSecRequest).then(function(response) {

            var idRespuestaEstadoSecAceptar = response.data.actualizarEstadoSECResponse.defaultServiceResponse.idRespuesta;

            if (idRespuestaEstadoSecAceptar == '0') {
                $scope.popDescripcionSec = listaSecAprovar.descripcion;
                $scope.loader = false;
                $scope.mostartAceptarSec = true;

            } else {
                $scope.loader = false;
                $scope.errorPop = true;
            }


        });

    };

    $scope.rechazarSec = function(listaSecRechazar) {
        $scope.loader = true;
        $(".popup").fadeIn();

        var actualizarSecRechazar = {
            numeroSEC: listaSecRechazar.numeroSEC,
            tipoOperacion: "04"
        }

        var actualizarSecRechazarRequest = $httpParamSerializer({ requestJson: angular.toJson(actualizarSecRechazar) });
        managerservice.actualizaEstadoSec(actualizarSecRechazarRequest).then(function(response) {


            var idRespuestaEstadoSecRechazar = response.data.actualizarEstadoSECResponse.defaultServiceResponse.idRespuesta;

            if (idRespuestaEstadoSecRechazar == '0') {
                $scope.popDescripcionSecRechazar = listaSecRechazar.descripcion;
                $scope.loader = false;
                $scope.mostartRechazarSec = true;

            } else {
                $scope.loader = false;
                $scope.errorPop = true;
            }


        });

    };

    $scope.verDocumentos = function(listaDocs) {
        $scope.loader = true;
        $(".popup").fadeIn();

        var obtenerListaDocumentos = {
            numeroSEC: listaDocs.numeroSEC
        }

        $scope.numeroSecActual = listaDocs.numeroSEC;

        var obtenerListaDocumentosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerListaDocumentos) });
        managerservice.obtenerListaDocsSec(obtenerListaDocumentosRequest).then(function(response) {

            var idRespuestaListaDocs = response.data.obtenerListadoDocumentosSECResponse.defaultServiceResponse.idRespuesta;

            if (idRespuestaListaDocs == '0') {

                $scope.listaDocs = response.data.obtenerListadoDocumentosSECResponse.listaArchivo.archivo;

                if (!Array.isArray($scope.listaDocs)) {
                    $scope.listaDocs = [];
                    $scope.listaDocs.push(response.data.obtenerListadoDocumentosSECResponse.listaArchivo.archivo);
                }

                $scope.loader = false;
                $scope.mostrarListaDocs = true;
                $scope.listaDocuments = true;

            } else if (idRespuestaListaDocs == '1') {
                $scope.loader = false;
                $scope.mostrarListaDocs = true;
                $scope.sinDocuments = true;
            } else {
                $scope.loader = false;
                $scope.errorPop = true;
            }

        });
    };

    $scope.verDoc = function(documento) {

        var obtenerDocumento = {
            numeroSEC: $scope.numeroSecActual,
            idArchivoDescarga: documento.idArchivoDescarga
        }

        var obtenerDocumentoRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerDocumento) });
        managerservice.obtenerDocSec(obtenerDocumentoRequest).then(function(response) {

            var idRespuestaVerDoc = response.data.obtenerDocumentoSECResponse.defaultServiceResponse.idRespuesta;

            if (idRespuestaVerDoc == '0') {
                    var archivoBase64 = response.data.obtenerDocumentoSECResponse.archivo;
                    var urlbase64 = b64toBlob(archivoBase64, 'application/pdf');
                    FileSaver.saveAs(urlbase64, documento.nombreArchivo);
            } else {
                $scope.listaDocuments = false;
                $scope.errorListaDocumeto = true;
            }

        });
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

});