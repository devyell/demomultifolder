function concatenarLista(listaBase,listaAgregar){
    if(Array.isArray(listaAgregar)){
        for (var i = 0; i < listaAgregar.length ; i++) {
            listaBase.push(listaAgregar[i]);
        };
    } else {
        listaBase.push(listaAgregar);
    }
    
    return listaBase;
}