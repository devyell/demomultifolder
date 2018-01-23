var appServices = angular.module('miClaroServices', []);

appServices.service('productoServicio', ['$http', function($http) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    var urlProductosServiciosPostpago = urlsComunProductoPrincipal.obtenerServicios;
    var urlProductosServiciosPrepago = urlsComunProductoPrincipal.obtenerServicios;
    var urlObtenerListadoMovilCorporativoCuenta = urlsComunProductoPrincipal.obtenerCorporativoCuenta;
    var urlObtenerListadoMovilCorporativoRecibo = urlsComunProductoPrincipal.obtenerCorporativoRecibo;
    var urlObtenerListadoFijoDireccion = urlsComunProductoPrincipal.obtenerDireccionesFija;
    var urlProductosCoorpo = urlsComunProductoPrincipal.obtenerServicios;
    var urlServiciosFijos = urlsComunProductoPrincipal.obtenerServicios;
    var urlobtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlObtenerServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
    var urlGuardarServicioPrincipal = urlsComunProductoPrincipal.guardarServicioPrincipal;
    var urlObetnerServiciosNoCliente = urlsComunProductoPrincipal.obtenerServicios;
    var urlBuscarServiciosxCriterio = urlsComunProductoPrincipal.obtenerServicios;
    var urlAutocompletarxCriterio = urlsComunProductoPrincipal.obtenerListadoMoviles;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;


    this.obtenerTipoCliente = function() {
        return $http.get(urlobtenerDatosUsuario);
    };

    this.obtenerServiciosNoCliente = function(datosNocli) {
        return $http.post(urlObetnerServiciosNoCliente, datosNocli);
    };

    this.obtenerProductosPostpago = function(dataPost) {
        return $http.post(urlProductosServiciosPostpago, dataPost);
    };

    this.obtenerProductosPrepago = function(datapre) {
        return $http.post(urlProductosServiciosPrepago, datapre);
    };

    this.obtenerCuentasCoorporativas = function() {
        return $http.get(urlObtenerListadoMovilCorporativoCuenta);
    };

    this.obtenerRecibosCoorporativos = function(data) {
        return $http.post(urlObtenerListadoMovilCorporativoRecibo, data);
    };
    this.obtenerProductosCoorporativo = function(dataCoor) {
        return $http.post(urlProductosCoorpo, dataCoor);
    };

    this.obtenerDireccionesFija = function(dataTipoCliente) {
        return $http.post(urlObtenerListadoFijoDireccion, dataTipoCliente);
    };

    this.obtenerProductosFijos = function(dataFija) {
        return $http.post(urlServiciosFijos, dataFija);
    };

    this.obtenerProductoPrincipal = function() {
        return $http.get(urlObtenerServicioPrincipal);
    };

    this.guardarServicioPrincipal = function(dataGuardar) {
        return $http.post(urlGuardarServicioPrincipal, dataGuardar);
    }

    this.obtenerServiciosxCriterio = function(buscarCriterio) {
        return $http.post(urlBuscarServiciosxCriterio, buscarCriterio);

    }

    this.obtenerServiciosAutocompletar = function(dataCriterio) {
        return $http.post(urlAutocompletarxCriterio, dataCriterio);

    }

    this.guardarAuditoria = function(dataAudita) {
        return $http.post(urlEnviarAuditoria, dataAudita);
    }

}]);
