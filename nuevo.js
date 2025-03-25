 // Función para mostrar/ocultar el menú desplegable
/*  function toggleDropdown() {
    const filtrar=document.getElementById("filtrar");
    const menu = document.getElementById("dropdown-menu");
    if (menu.style.display === "block") {
        filtrar.innerHTML="Filtrar";
        filtrar.style.border="none";
        menu.style.display = "none";
        filtrar.style.backgroundColor="transparent";
    } else {
        menu.style.display = "block";
        filtrar.innerHTML="cerrar";
        filtrar.style.border="1px solid gray";
        filtrar.style.backgroundColor="rgb(49, 47, 47)";
    }
    
} */

/* const seleccionadas=["agricultura", "farmaceutica", "diagnostico"];  */
/* const seleccionadas=["Empresa", "Instituto", "Grupo de investigación", "Universidad", "Aceleradora", "Incubadora", "Organismos estatales"]; 
 */
/* const seleccionadas=["Empresa", "Instituto", "Grupo de investigación", "Aceleradora", "Incubadora", "Organismos estatales", "Universidad"]; 
 */
const contenedorResultados = document.querySelector("#resultados");
const inputBuscador = document.getElementById("buscador");
 // captura del contenedor #tooltip para mostrar DATOS DEL ELEMENTO SELECCIONADO
 /* const tooltip=document.querySelector("#tooltip"); */


// para que apenas cargue la página aparezcan TODOS LOS ITEMS seleccionados y se muestren
/* window.onload= recarga(seleccionadas); */





//----------------------------------   FUNCIONES  ---------------------------------------------------

// Función para mostrar las opciones seleccionadas
/* function mostrarSeleccion() {
    
    const checkboxes = document.querySelectorAll("#dropdown-menu input[type='checkbox']:checked");
    const seleccion = Array.from(checkboxes).map(checkbox => checkbox.value); 
    if(seleccion.length > 0){
        recarga(seleccion);
    }else{
        recarga(seleccionadas);
    }
    
    
   toggleDropdown();
  
} */

//--------------------------------------------------------------------------



// Función para eliminar tildes (normalizar texto). Sirve para normalizar texto ingresado por inputs

function quitarTildes(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza y elimina diacríticos
}


//--------------------------------------------------------------------------

//  función para filtrado DINÁMICO (BUSCADOR). 
// Requiere pasarle por parámetros: 
// 1 input capturado desde JS (inputBuscador)
// El array de elementos que serán sujetos a filtrado según lo que ingrese por inputBuscador
 


/* function buscar(inputBuscador, dondeBuscar){

    let resultadoFiltrado = [];  // arreglo donde se agregarán los elementos resultado del filtro
    // Evento para realizar el filtrado
    inputBuscador.addEventListener("input", () => {

        //  ESTILOS DEL BUSCADOR

        if (inputBuscador.value.trim() !== "") {
            inputBuscador.classList.add("buscador-lleno");
        }else{
            inputBuscador.classList.remove("buscador-lleno");
            inputBuscador.classList.add("buscador-vacio");
        }



        const textoBusqueda = quitarTildes(inputBuscador.value.trim().toLowerCase()); // Convertir a minúsculas y eliminar tildes

         
        // Filtrar los elementos del arreglo "filtro"
         resultadoFiltrado = dondeBuscar.filter(item => {
            // Aplica el término de búsqueda en ambas propiedades: label y description
             const coincideLabel = quitarTildes(item.Label.toLowerCase()).includes(textoBusqueda.toLowerCase()); 
            const coincideDescription = quitarTildes(item.Description.toLowerCase()).includes(textoBusqueda.toLowerCase());
            
            // Retorna verdadero si el término está en al menos una de las propiedades y 
            // agrega ese elemento al array resultadoFiltrado
            return  coincideLabel ||  coincideDescription;
          });
         
    
           
    
           

      

        //  llamo función para MOSTRAR LOS RESULTADOS

            imprimirHtmlResultados(resultadoFiltrado);  

        });

        
        
} */



        function buscar(inputBuscador, dondeBuscar, contenedorResultados) {
            let resultadoFiltrado = [];
            inputBuscador.addEventListener("input", () => {
              if (inputBuscador.value.trim() !== "") {
                inputBuscador.classList.add("buscador-lleno");
               
              } else {
                inputBuscador.classList.remove("buscador-lleno");
             
                inputBuscador.classList.add("buscador-vacio");
              }
          
              // Dividir el texto ingresado en palabras separadas
              const palabrasBusqueda = quitarTildes(inputBuscador.value.trim().toLowerCase())
                                        .split(/\s+/)
                                        .filter(palabra => palabra.length > 0); // Filtrar palabras vacías
          
              resultadoFiltrado = dondeBuscar.filter(item => {
                const descriptionLower = quitarTildes(item.Description.toLowerCase());
          
                // Verificar que todas las palabras coincidan en Description
                const coincideDescription = palabrasBusqueda.every(palabra => descriptionLower.includes(palabra));
          
                if (coincideDescription) {
                  // Generar una porción relevante de texto para cada término de búsqueda
                  item.HighlightedDescription = palabrasBusqueda
                    .map(palabra => extractContext(descriptionLower, palabra, item.Description))
                    .join("...");
                }
          
                return coincideDescription; // Mostrar solo si todas las palabras coinciden
              });
          
              imprimirResultados(resultadoFiltrado);
            });
          }
          
          function extractContext(texto, busqueda, originalTexto) {
            // Encontrar la posición del término en el texto y extraer el contexto
            const index = texto.indexOf(busqueda);
            if (index === -1) return ""; // Retornar vacío si no hay coincidencia
            const contextLength = 20; // Cantidad de caracteres alrededor del término
            const start = Math.max(0, index - contextLength);
            const end = Math.min(texto.length, index + busqueda.length + contextLength);
            return originalTexto.substring(start, end); // Extraer texto original alrededor de la coincidencia
          }
          
          function imprimirResultados(resultadoFiltrado) {
            contenedorResultados.innerHTML = ""; // Limpiar el contenedor
            
            contenedorResultados.classList.add("bg-display");
           
                resultadoFiltrado.forEach(item => {
                    const h3 = document.createElement("h3");
                    const h4 = document.createElement("h4");
                    h3.innerHTML = `${item.Label}`;
                    h4.innerHTML = resaltarTexto(item.HighlightedDescription || item.Description, inputBuscador.value);
                    contenedorResultados.appendChild(h3);
                    contenedorResultados.appendChild(h4);
                
      
                    h3.addEventListener("click", () => {
                      tooltip.innerHTML = `
                        <h3>${item.Label}</h3>
                        <h4>${item.Type}</h4>
                        <h4>${resaltarTexto(item.Description, inputBuscador.value)}</h4>
                        <p class="web-link">
                          <a class="a" href="${item.web || item.url}" target="_blank">website</a>
                        </p>
                      `;
                      tooltip.style.backgroundColor = "rgb(23, 23, 23)",
                      tooltip.style.boxShadow = "inset -3px -20px 1.5rem rgb(93, 91, 91)";

                    });
            });
          }
          
          function resaltarTexto(texto, busqueda) {
            if (!busqueda || busqueda.trim().length === 0) return texto; // Retorna el texto sin cambios si no hay búsqueda
          
            // Dividir el término de búsqueda en palabras separadas
            const palabras = quitarTildes(busqueda.trim().toLowerCase()).split(/\s+/).filter(palabra => palabra.length > 0);
          
            // Escapar caracteres especiales en las palabras
            const escaparRegex = palabra => palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          
            // Crear una expresión regular incluyendo todas las palabras
            const regex = new RegExp(`(${palabras.map(escaparRegex).join("|")})`, "gi");
          
            // Reemplazar todas las coincidencias en el texto con la etiqueta <mark>
            return texto.replace(regex, "<mark>$1</mark>");
          }
          





















/* 

        function buscar(inputBuscador, dondeBuscar) {
            let resultadoFiltrado = [];
            inputBuscador.addEventListener("input", () => {
              if (inputBuscador.value.trim() !== "") {
                inputBuscador.classList.add("buscador-lleno");
              } else {
                inputBuscador.classList.remove("buscador-lleno");
                inputBuscador.classList.add("buscador-vacio");
              }
          
              // Dividir el texto ingresado en palabras separadas
              const palabrasBusqueda = quitarTildes(inputBuscador.value.trim().toLowerCase())
                                        .split(/\s+/)
                                        .filter(palabra => palabra.length > 0); // Filtrar palabras vacías
          
              resultadoFiltrado = dondeBuscar.filter(item => {
                const descriptionLower = quitarTildes(item.Description.toLowerCase());
          
                // Verificar que todas las palabras coincidan en Description
                const coincideDescription = palabrasBusqueda.every(palabra => descriptionLower.includes(palabra));
          
                if (coincideDescription) {
                  item.HighlightedDescription = palabrasBusqueda.map(palabra => extractContext(descriptionLower, palabra, item.Description)).join("...");
                }
          
                return coincideDescription; // Mostrar solo si todas las palabras coinciden
              });
          
              imprimirResultados(resultadoFiltrado);
            });
          }
          
          function extractContext(texto, busqueda, originalTexto) {
            const index = texto.indexOf(busqueda);
            if (index === -1) return "";
            const contextLength = 20; // Cantidad de caracteres alrededor del término
            const start = Math.max(0, index - contextLength);
            const end = Math.min(texto.length, index + busqueda.length + contextLength);
            return originalTexto.substring(start, end); // Extrae texto original alrededor de la coincidencia
          }
          
          function imprimirResultados(resultadoFiltrado) {
            contenedorResultados.innerHTML = ""; // Limpiar el contenedor
          
            resultadoFiltrado.forEach(item => {
              const h3 = document.createElement("h3");
              const h4 = document.createElement("h4");
              h3.innerHTML = `${item.Label}`;
              h4.innerHTML = resaltarTexto(item.HighlightedDescription || item.Description, inputBuscador.value);
              contenedorResultados.appendChild(h3);
              contenedorResultados.appendChild(h4);
          

              h3.addEventListener("click", () => {
                tooltip.innerHTML = `
                  <h3>${item.Label}</h3>
                  <h4>${item.Type}</h4>
                  <h4>${resaltarTexto(item.Description, inputBuscador.value)}</h4>
                  <p class="web-link">
                    <a class="a" href="${item.web || item.url}" target="_blank">website</a>
                  </p>
                `;
                tooltip.style.backgroundColor = "rgb(80, 80, 80)";
              });
            });
          }
          




          function resaltarTexto(texto, busqueda) {
            if (!busqueda || busqueda.trim().length === 0) return texto; // Retorna el texto sin cambios si no hay búsqueda
          
            // Dividir el término de búsqueda en palabras separadas
            const palabras = quitarTildes(busqueda.trim().toLowerCase()).split(/\s+/).filter(palabra => palabra.length > 0);
          
            // Escapar caracteres especiales en las palabras
            const escaparRegex = palabra => palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          
            // Crear una expresión regular incluyendo todas las palabras
            const regex = new RegExp(`(${palabras.map(escaparRegex).join("|")})`, "gi");
          
            // Reemplazar todas las coincidencias en el texto con la etiqueta <mark>
            return texto.replace(regex, "<mark>$1</mark>");
          } */
          

//--------------------------------------------------------------------------

//  función para MOSTRAR los resultados del filtrado en el HTML

// Previamente hay que tener capturados el contenedor donde se mostrarán los resultados (contenedorResultados)
// y el contenedor donde se mostrarán los detalles del item (tooltip)


// Requiere pasarle por PARÁMETRO el ARRAY resultado del filtrado (resultadoFiltrado)


/* 
function imprimirHtmlResultados(resultadoFiltrado){
   
    // Limpiar el contenedor y mostrar los resultados filtrados
     contenedorResultados.innerHTML = "";

     
        resultadoFiltrado.forEach(item => {
            const h3 = document.createElement("h3");  
            h3.textContent = item.Label;
      
            const h4 = document.createElement("h4"); //crea un h3 para cada resultado
            h4.textContent = item.Description.substring(0, 70); 
           
            contenedorResultados.appendChild(h3);
            contenedorResultados.appendChild(h4); 
   

          // Agrega un evento click al h3
            h3.addEventListener("click", () => {


                if(item.web !="" | item.url !=""){
                    tooltip.innerHTML= `
                        <h3>${item.Label}</h3><br>
                        <h4>${item.Type}</h4>
                        <h4>${item.Description}</h4>
                        <p class="web-link">
                            <a class="a" href="${item.web} ${item.url}" target="_blank">website</a>
                        </p> 
                    `;
                }else{
                    tooltip.innerHTML= `
                        <h3>${item.Label}</h3><br>
                        <h4>${item.Type}</h4>
                        <h4>${item.Description}</h4>
                        
                       `;
                }
       
                tooltip.style.backgroundColor= "rgb(80, 80, 80)"; 
            });   
        
   
            
            
       
     }); 
    }
 */

//--------------------------------------------------------------------------
d3.json("nano.json").then(function(data){
    
    


     //  llamo función "buscar" para que busque cada caracter ingresado dentro de la base de datos   
    buscar(inputBuscador, data);

   //-------------------------------------------------------------------

    // IMPRESIÓN DE CANTIDAD DE RESULTADOS LUEGO DEL FILTRADO

   /*  const cantidadResultados=document.querySelector("#cantidad-resultados"); 

   
    
    let htmlCantidad=`${filtro.length} resultados`;
    
    cantidadResultados.innerHTML= htmlCantidad;
    */
   //----------------------------------------------------------------------------
    
    // llamo "imprimirResultados"
/* 
    imprimirResultados(filtro);  */

});

//--------------------------------------------------------------------------


function recarga(sel){
  
    var filtro=[];
    d3.json("nano.json").then(function(data){
    
        data.forEach(function(item) {
          
            // CAPTURO LOS ITEMS SELECCIONADOS PARA FILTRAR

            if(item.Type== sel[0] | item.Type==sel[1]| item.Type==sel[2] | item.Type==sel[3] | item.Type==sel[4]| item.Type==sel[5] | item.Type==sel[6]){
                filtro.push(item);
                
            }
        }) 

   
   
         //  llamo función "buscar" para que busque cada caracter ingresado dentro de la base de datos   
        buscar(inputBuscador, filtro);
   
       //-------------------------------------------------------------------

        // IMPRESIÓN DE CANTIDAD DE RESULTADOS LUEGO DEL FILTRADO

        const cantidadResultados=document.querySelector("#cantidad-resultados");

       
        
        let htmlCantidad=`${filtro.length} resultados`;
        
        cantidadResultados.innerHTML= htmlCantidad;
        
       //----------------------------------------------------------------------------
        
        // llamo "imprimirResultados"

        imprimirResultados(filtro); 


        //----------------------------------------------------------------------
            
        var svg = d3.select("svg")
            .attr("width", 280)
            .attr("height", 600);
/* 
          svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
             .attr("fill", "#b3d9ff");  */ // Celeste para el fondo



        // cambiando colores del fondo del mapa (en este caso el océano)
            var defs = svg.append("defs");
            var linearGradient = defs.append("linearGradient")
                .attr("id", "ocean-gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");
            
            linearGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "rgb(141, 194, 214)") // Celeste
                .attr("stop-opacity", 1);
            
            linearGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "rgb(65, 87, 149)") // azul
                .attr("stop-opacity", 1);
            
            svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "url(#ocean-gradient)"); // Aplica el gradiente al fondo






        var projection = d3.geoMercator()
            .scale(700)
            
            .center([-35.5, -37]); // Ajusta el centro a [0, 0] para asegurarse de que los datos se mapeen correctamente

        var path = d3.geoPath().projection(projection);

        var g = svg.append("g");




//-------------------------------------------------------------------------------





        // Cargar y dibujar el mapa de fondo
        d3.json("world-geojson2.json").then(function(world) {
            
           
        // Filtrar solo Argentina
    /*  var argentina = data.features.filter(function(feature) {
            return feature.properties.ADMIN === "Argentina";
        }); */


          

            g.selectAll("path")
                .data(world.features)
                /* .data(argentina) */
                .enter().append("path")
                .attr("d", path)
                .attr("class", "land")
                .attr("fill",  function(d) {
                    // Cambia según la región o una propiedad específica
                    if (d.properties.NAME==="Argentina"){
                        return "rgb(57, 56, 56)"; // color Argentina
                    } else {
                        return "rgb(147, 146, 142)"; // color resto de países
                    }
                } )
                /* .attr("stroke", "#ffffaa") */
                /* .on("mouseover", function(event, d) {
                    if (d.properties.NAME === "Argentina"){
                        d3.select(this).attr("fill", "rgb(57, 90, 58)"); // Cambiar a un color al pasar el mouse
                    }
                    
                })
                .on("mouseout", function(event, d) {
                    if (d.properties.NAME === "Argentina"){
                        d3.select(this).attr("fill", "rgb(30, 61, 32)"); // Volver al color original
                    }
                    
                }) */
                .attr("stroke", "rgb(116, 126, 116)");
        
            g.selectAll("circle")
                .data(filtro)
                .enter().append("circle")
                /* .attr("cx", function(d) { return projection([d.longitud, d.latitud])[0]; })
                .attr("cy", function(d) { return projection([d.longitud, d.latitud])[1]; }) */
                .attr("cx", function(d) {
                    // Extrae y separa las coordenadas del campo "location"
                    const coords = d.location.split(","); // Divide por la coma
                    const longitud = parseFloat(coords[1]); // Toma el segundo valor como longitud
                    const latitud = parseFloat(coords[0]);  // Toma el primer valor como latitud
                    return projection([longitud, latitud])[0]; // Proyección para X
                  })
                  .attr("cy", function(d) {
                    const coords = d.location.split(","); // Divide por la coma
                    const longitud = parseFloat(coords[1]);
                    const latitud = parseFloat(coords[0]);
                    return projection([longitud, latitud])[1]; // Proyección para Y
                  })
                /* .attr("r", 2) */

                /*  ESTILOS DE LOS CÍRCULOS SEGÚN EL TIPO DE ESTABLECIMIENTO */
                .attr("class", function(filtro){
                    
                    if(filtro.Type=="Empresa"){
                        return "empresa";
                    }
                    if(filtro.Type=="Instituto"){
                        return "instituto";
                    }
                    if(filtro.Type=="Universidad"){
                        
                        return "universidad";
                    }
                    if(filtro.Type=="Grupo de investigación"){
                        return "grupo-investigacion";
                    }
                    if(filtro.Type=="Aceleradora"){
                        return "aceleradora";
                    }
                    if(filtro.Type=="Incubadora"){
                        
                        return "incubadora";
                    }
                    if(filtro.Type=="Organismos estatales"){
                        return "organismos-estatales";
                    }
                })
                .on("click", function(event, d) {
                    
                    // Mostrar el tooltip al pasar el mouse
                    d3.select("#tooltip")
                        .style("visibility", function(clearDescription){
                            if(clearDescription){
                                return "none";
                            }else{
                                return "visible";
                            }
                            })
                        .style("background-color", "rgb(80, 80, 80")
                        
                       /*  .style("top", (event.pageY + 10) + "px")
                        .style("left", (event.pageX + 10) + "px") */
                        .html(function(){
                           
                                if(d.web !="" | d.url !=""){
                                return `
                                 <h3>${d.Label}</h3><br>
                                 <h4>${d.Type}</h4>
                                 <h4>${d.Description}</h4>
                                <p class="web-link">
                                    <a class="a" href="${d.web} ${d.url}" target="_blank">website</a>
                                </p> 
                                    `;
                                }else{
                                    return `
                                    <h3>${d.Label}</h3><br>
                                    <h4>${d.Type}</h4>
                                    <h4>${d.Description}</h4>
                                   
                                       `;
                                   }
                                 

                            
                                        
                                         
                        })
                    
                })
               /*  .on("mouseout", function (event, d) {
                    d3.select("#tooltip")
                    .style("visibility", "hidden")
                }) */
               ;
            
        }).catch(function(error) {
            console.error("Error cargando el archivo world-geojson.json:", error); // Mensaje de error en caso de que no se cargue el GeoJSON
        });








//-------------------------------------------------------------------------------



        // Definir la variable de zoom y desplazamiento
        var zoom = d3.zoom()
            .scaleExtent([1, 150])
            .on("zoom", function(event) {
            /*  console.log("Evento de zoom:", event); // Mensaje de depuración completo */
                g.attr("transform", event.transform);
            });

        // Añadir capacidad de zoom y desplazamiento al SVG
        svg.call(zoom);

        d3.select("#zoom_in").on("click", function() {
       
            svg.transition().call(zoom.scaleBy, 1.3);
        });

        d3.select("#zoom_out").on("click", function() {
           
            svg.transition().call(zoom.scaleBy, 0.8);
        });

        d3.select("#reset").on("click", function() {
          
            svg.transition().call(zoom.transform, d3.zoomIdentity);
        });
    }).catch(function(error) {
        console.error("Error cargando el archivo empresas_biotecnologicas.json:", error);
    });
}


// Añadir el manejador de eventos `wheel` con la opción pasiva para evitar el error de rendimiento
document.addEventListener("wheel", function(e) {
// Tu código aquí, si es necesario
}, { passive: true });




