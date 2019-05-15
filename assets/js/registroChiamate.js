/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function()
{    
    //Dichiaro gli array globali che conterranno i valori ottenuti dal db 
    //per ogni riga della tabella
    $idApp = [];
    $cliente = [];
    $sede = [];
    $risp_tel = [];
    $risp_mess = [];
    $nota = [];
    $fiss_app = [];
    $vend_pac = [];
    $data_ora_ch = [];
    $data_ora_app = [];
    $nome_op = [];
    $trat = [];
    $nome_pac = [];
    $id_pac = [];
    
    //Imposto gli array col valore dei risultati ottenuti dal model;
    //uso length - 1 perché escludo la riga dell'header
    for(var i=0;i<$('tr').length-1;i++)
    {
        $idApp.push(results[i].id_app);
        $cliente.push(results[i].nome + " " + results[i].numero);
        
        //Se è presente un id di sede ottengo il nome della sede dall'array di sedi
        if (results[i].sede != null)
        {
            $.each(listaSedi, function(index, value){
                if (value.id_sede == results[i].sede)
                {
                    $sede.push(value.indirizzo);
                    return false;
                }
            });
        }
        else
        {
            $sede.push(null);
        }
            
        $risp_tel.push(results[i].risp_tel);
        $risp_mess.push(results[i].risp_mess);
        $nota.push(results[i].nota);
        $fiss_app.push(results[i].fiss_app);
        $vend_pac.push(results[i].vend_pac);
      
        //Formatto la data della chiamata
        var tData = results[i].data_ora_ch.split(" ")[0];
        var tOra = results[i].data_ora_ch.split(" ")[1];
        var $dataOra = formattaDataOra(tData, tOra);

        $data_ora_ch.push($dataOra);
        
        //Formatto la data dell'appuntamento
        if (results[i].data_ora_app == null)
            $data_ora_app.push(null);
        else
        {
            var tData = results[i].data_ora_app.split(" ")[0];
            var tOra = results[i].data_ora_app.split(" ")[1];
            var $dataOra = formattaDataOra(tData, tOra);
            
            $data_ora_app.push($dataOra);
        }
       
        $nome_pac.push(results[i].nome_pacc);
        $id_pac.push(results[i].id_pacc);
        $nome_op.push(results[i].operatrice);
        $trat.push(results[i].trattamento);
        
        //attivo blocchi, singoli tasti e coloro le righe
        controlloAttivazioneBlocchi(i);       
        controlloAttivazioneTasti(i);
        coloreRiga(i);
    }
    
    //Counter dei pacchetti venduti
    if (lastPac != null)
    {
        $num = parseInt(lastPac) + 1;
    }
    else
    {
       $num = 1; 
    }
    
    //Associa i tasti di selezione eliminazione riga al tasto X (generazione iniziale tabella)
    $("button#delButton").each(function(i, val){
        var row = $(this).parents("tr");
        $(val).confirm({
            title: "Eliminazione",
            content: "Cosa vuoi eliminare?",
            useBootstrap: false,
            type: "red",
            columnClass: "medium",
            buttons: 
            {
                contenuto: //Tasto eliminazione contenuto
                {
                    text: "Contenuto",
                    btnClass: 'btn-red',
                    action: function()
                    {
                        $.ajax({
                            type: "POST",
                            url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                            data: {
                                idApp: $idApp[i],
                                comando: "resetRiga"
                            },
                            success: function()
                            {
                                $risp_tel[i] = null;
                                $risp_mess[i] = null;
                                $nota[i] = null;
                                $fiss_app[i] = null;
                                $data_ora_app[i] = null;
                                $vend_pac[i] = null;

                                //se era l'ultimo pacchetto "venduto" decremento perché non l'ho mai realmente venduto
                                if ($id_pac[i] == $num-1)
                                {
                                    $num--;
                                }
                                $id_pac[i] = null;
                                $nome_op[i] = null;
                                $nome_pac[i] = null;

                                coloreRiga(i);
                                controlloAttivazioneBlocchi(i);
                                controlloAttivazioneTasti(i);
                            },
                            error: function()
                            {
                                alert("Non è stato possibile eliminare il contenuto");
                            }
                        });
                    }
                    
                },
                riga: //Tasto eliminazione riga intera
                {
                    text: "Riga intera",
                    btnClass: 'btn-red',
                    action: function()
                    {
                        if ($idApp[i] != null)
                        {
                            $.ajax({
                                type: "POST",
                                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                                data: {
                                    idApp: $idApp[i],
                                    comando: "delRiga"
                                },
                                success: function()
                                {
                                    $risp_tel.splice($.inArray($risp_tel[i],$risp_tel),1);
                                    $risp_mess.splice($.inArray($risp_mess[i],$risp_mess),1);
                                    $nota.splice($.inArray($nota[i],$nota),1);
                                    $fiss_app.splice($.inArray($fiss_app[i],$fiss_app),1);
                                    $data_ora_app.splice($.inArray($data_ora_app[i],$data_ora_app),1);
                                    $vend_pac.splice($.inArray($vend_pac[i],$vend_pac),1);


                                    //se era l'ultimo pacchetto "venduto" decremento perché non l'ho mai realmente venduto
                                    if ($id_pac[i] == $num-1)
                                    {
                                        $num--;
                                    }
                                    $id_pac.splice($.inArray($id_pac[i],$id_pac),1);
                                    $nome_op.splice($.inArray($nome_op[i],$nome_op),1);
                                    $nome_pac.splice($.inArray($nome_pac[i],$nome_pac),1);

                                    row.remove();

                                },
                                error: function()
                                {
                                    alert("Non è stato possibile eliminare la riga");
                                }
                            });
                        }
                        else
                        {
                            row.remove();
                        }
                    }
                },
                annulla: //Tasto annulla
                {
                    text: "Annulla",
                    action: function(){}
                }
            }
        });
    });
    
    //Mostra un form per l'inserimento di una nuova sede
    $('button#addSede').confirm({
        title: "Nuova sede",
        content: "<div>Inserisci la nuova sede: " + 
                "<input type='text' id='addSedeText'></input><div>",
        type: "red",
        columnClass: "medium",
        useBootstrap: false,
        buttons:
        {
            inserisci: //Tasto invio nuova sede
            {
                text: "Inserisci",
                btnClass: "btn-blue",
                action: function()
                {
                    var input = this.$content.find("#addSedeText").val();
                    
                    if (!input)
                    {
                        alert("Input non valido");
                        return false;
                    }
                    else
                    {
                        $.ajax({
                            type: "POST",
                            url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                            data: {
                                comando: "addSede",
                                sede: input
                            },
                            success: function(lista)
                            {
                                listaSedi = JSON.parse(lista);
                                $(".elencoSedi").empty();
                                $("#filtraSede").append("<option value='all'>Tutte</option>");
                                $(listaSedi).each(function(index,val)
                                {
                                    $(".elencoSedi").each(function()
                                    {
                                       $(this).append("<option value='"+val.id_sede+"'>"+val.indirizzo+"</option>"); 
                                    });
                                });
                            },
                            error: function()
                            {
                                alert("Non è stato possibile inserire la nuova sede");
                            }
                        });
                    }
                }
                
            },
            annulla: //Tasto annullamento
            {
                text: "Annulla"
            }
        }
    });
    
    //Attiva la creazione di una nuova riga
    $('button.addUser').click(function()
    {
        var $i = $('#clienti tr').length - 1;
        
        //Nascondo il testo "Nessun appuntamento"
        $("#noClienti").attr("hidden",true);
        
        //Inserisco una nuova riga dopo l'ultima inserita
        $('#clienti tr').eq($i).after(nuovaRiga);

        //Inserisco un nuovo elemento vuoto negli array 
        //globali per il futuro inserimento dei dati
        $idApp.push(null);
        $cliente.push(null);
        $risp_tel.push(null);
        $risp_mess.push(null);
        $nota.push(null);
        $fiss_app.push(null);
        $vend_pac.push(null);
        $data_ora_ch.push(null);
        $data_ora_app.push(null);
        $nome_pac.push(null);
        $id_pac.push(null);
        $nome_op.push(null);
        $trat.push(null);
        $sede.push(null);
        
        //Recupero la nuova riga
        var row = $("#clienti tr").eq($i+1);
        
        //Imposto il tasto di eliminazione riga/contenuto per la nuova riga
        $("button#delButton").eq($i).confirm({
            title: "Eliminazione",
            content: "Cosa vuoi eliminare?",
            useBootstrap: false,
            type: "red",
            columnClass: "medium",
            buttons: 
            {
                contenuto: 
                {
                    text: "Contenuto",
                    btnClass: 'btn-red',
                    action: function()
                    {
                        $.ajax({
                            type: "POST",
                            url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                            data: {
                                idApp: $idApp[$i],
                                comando: "resetRiga"
                            },
                            success: function()
                            {
                                $risp_tel[$i] = null;
                                $risp_mess[$i] = null;
                                $nota[$i] = null;
                                $fiss_app[$i] = null;
                                $data_ora_app[$i] = null;
                                $vend_pac[$i] = null;

                                //se era l'ultimo pacchetto "venduto" decremento perché non l'ho mai realmente venduto
                                if ($id_pac[$i] == $num-1)
                                {
                                    $num--;
                                }
                                $id_pac[$i] = null;
                                $nome_op[$i] = null;
                                $nome_pac[$i] = null;

                                coloreRiga($i);
                                controlloAttivazioneBlocchi($i);
                                controlloAttivazioneTasti($i);
                            },
                            error: function()
                            {
                                alert("Non è stato possibile eliminare il contenuto");
                            }
                        });
                    }
                    
                },
                riga: 
                {
                    text: "Riga intera",
                    btnClass: 'btn-red',
                    action: function()
                    {
                        if ($idApp[$i] != null)
                        {
                            $.ajax({
                                type: "POST",
                                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                                data: {
                                    idApp: $idApp[$i],
                                    comando: "delRiga"
                                },
                                success: function()
                                {
                                    $risp_tel.splice($.inArray($risp_tel[$i],$risp_tel),1);
                                    $risp_mess.splice($.inArray($risp_mess[$i],$risp_mess),1);
                                    $nota.splice($.inArray($nota[$i],$nota),1);
                                    $fiss_app.splice($.inArray($fiss_app[$i],$fiss_app),1);
                                    $data_ora_app.splice($.inArray($data_ora_app[$i],$data_ora_app),1);
                                    $vend_pac.splice($.inArray($vend_pac[$i],$vend_pac),1);


                                    //se era l'ultimo pacchetto "venduto" decremento perché non l'ho mai realmente venduto
                                    if ($id_pac[$i] == $num-1)
                                    {
                                        $num--;
                                    }
                                    $id_pac.splice($.inArray($id_pac[$i],$id_pac),1);
                                    $nome_op.splice($.inArray($nome_op[$i],$nome_op),1);
                                    $nome_pac.splice($.inArray($nome_pac[$i],$nome_pac),1);

                                    row.remove();
                                },
                                error: function()
                                {
                                    alert("Non è stato possibile eliminare la riga");
                                }
                            });
                        }
                        else
                        {
                            row.remove();
                        }
                    }
                },
                annulla: 
                {
                    text: "Annulla",
                    action: function(){}
                }
            }
        });
        
        //Reimposto le sedi selezionabili col valore aggiornato
        row.find("select.elencoSedi").empty();
        $(listaSedi).each(function(index,val)
        {
            row.find("select.elencoSedi").append("<option value='"+val.id_sede+"'>"+val.indirizzo+"</option>");
        });
        
        controlloAttivazioneBlocchi($i);
        controlloAttivazioneTasti($i);
        
        //Eseguo uno scroll fino al nuovo elemento inserito
        $('#clienti tr')[$i+1].scrollIntoView();
    });
    
    //Imposta il filtro per sede degli appuntamenti
    $('#filtraSede').click(function()
    {
        //Controllo che il dropdown menu sia già aperto
        //(evito che il filtro venga attivato anche quando
        //sto aprendo il menu)
        if ($(this).is(".open"))
        {
            //Recupero l'opzione selezionata
            var filtro = $(this).children("option:selected").val();
            
            //Elimino tutte le righe degli appuntamenti
            $("td").parent().remove();

            //Ripulisco gli array globali
            $idApp = [];
            $cliente = [];
            $sede = [];
            $risp_tel = [];
            $risp_mess = [];
            $nota = [];
            $fiss_app = [];
            $vend_pac = [];
            $data_ora_ch = [];
            $data_ora_app = [];
            $nome_op = [];
            $trat = [];
            $nome_pac = [];
            $id_pac = [];

            //Preparo il counter per l'inserimento delle nuove righe e
            //dei relativi dati negli array globali
            var $i = 0;

            //Recupero il valore del filtro per la chiamata AJAX adeguata
            if (filtro == 'all')
                var comando = 'getClienti';
            else
                var comando = 'getClientiFiltrati';

            //Recupero i dati degli appuntamenti dal DB
            $.ajax({
                type: "POST",
                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                data: {
                    comando: comando,
                    sede: filtro
                },
                success: function(json){
                    //Aggiorno l'oggetto contenente i dati degli appuntamenti
                    results = JSON.parse(json);

                    //Per ogni riga ottenuta inserisco una riga nella tabella
                    //ed aggiorno la relativa cella degli array globali
                    $.each(results, function(index,res)
                    {
                        //Simulo un click sul tasto per aggiungere una nuova riga
                        $('button.addUser').click();
                        
                        //Aggiungo i dati negli array globali
                        $idApp[$i] = res.id_app;
                        $cliente[$i] = res.nome + " " + res.numero;
                        if (res.sede != null)
                        {
                            $.each(listaSedi, function(index, value){
                                if (value.id_sede == res.sede)
                                {
                                    $sede[$i] = value.indirizzo;
                                    return false;
                                }
                            });
                        }
                        else
                        {
                            $sede[$i] = null;
                        }

                        $risp_tel[$i] = res.risp_tel;
                        $risp_mess[$i] = res.risp_mess;
                        $nota[$i] = res.nota;
                        $fiss_app[$i] = res.fiss_app;
                        $vend_pac[$i] = res.vend_pac;

                        //Formatto e inserisco la data della chiamata
                        var tData = res.data_ora_ch.split(" ")[0];
                        var tOra = res.data_ora_ch.split(" ")[1];
                        var $dataOra = formattaDataOra(tData, tOra);
                        $data_ora_ch[$i] = $dataOra;

                        //Formatto e inserisco la data dell'appuntamento
                        if (res.data_ora_app == null)
                            $data_ora_app[$i] = null;
                        else
                        {
                            var tData = res.data_ora_app.split(" ")[0];
                            var tOra = res.data_ora_app.split(" ")[1];
                            var $dataOra = formattaDataOra(tData, tOra);
                            $data_ora_app[$i] = $dataOra;
                        }

                        $nome_pac[$i] = res.nome_pacc;
                        $id_pac[$i] = res.id_pacc;
                        $nome_op[$i] = res.operatrice;
                        $trat[$i] = res.trattamento;

                        //Aggiorno la visualizzazione della riga inserita
                        coloreRiga($i);
                        controlloAttivazioneBlocchi($i);
                        controlloAttivazioneTasti($i);
                        $i++;

                    });
                },
                error: function()
                {
                    alert("Non è stato possibile inserire i dati nel DB");
                }

            });
            
            //rimuovo la classe "open" per indicare che ho chiuso il menu
            $(this).removeClass("open");
        }
        else
        {
            //Se il dropdown menu non è aperto, aggiungo la classe "open"
            //per indicare che è aperto
            $(this).addClass("open");
        }
  
    }).blur(function()
    {
        //Se ho clickato fuori dal menu rimuovo la classe "open"
        $(this).removeClass("open");
    });
    
    //Aggiunge le funzionalità dei tasti SI
    $( "body" ).on( "click", ".si", {}, function()
    {
        var $r = $(this).parents("tr").index()-1;
        
        //Aggiorno il valore dei tasti
        switch ($(this).parent().attr("class"))
        {
            case 'risp': 
                $risp_tel[$r] = true; 
                $.ajax({
                    type: "POST",
                    url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    data: {
                        idApp: $idApp[$r],
                        tasto: $risp_tel[$r],
                        comando: 'risp'
                    },
                    error: function()
                    {
                        alert("Non è stato possibile inserire i dati nel DB");
                    }
                });
                break;
            case 'mess': 
                $risp_mess[$r] = true; 
                $.ajax({
                    type: "POST",
                    url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    data: {
                        idApp: $idApp[$r],
                        tasto: $risp_mess[$r],
                        comando: 'mess'
                    },
                    error: function()
                    {
                        alert("Non è stato possibile inserire i dati nel DB");
                    }
                });
                break;
            case 'app':
                $fiss_app[$r] = true; 
                $.ajax({
                    type: "POST",
                    url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    data: {
                        idApp: $idApp[$r],
                        tasto: $fiss_app[$r],
                        comando: 'app'
                    },
                    error: function()
                    {
                        alert("Non è stato possibile inserire i dati nel DB");
                    }
                });
                break;
            case 'pacc':
                $vend_pac[$r] = true;
                
                $.ajax({
                    type: "POST",
                    url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    data: {
                        idApp: $idApp[$r],
                        tasto: $vend_pac[$r],
                        idPac: $num,
                        comando: 'si_pacc'
                    },
                    success: function()
                    {
                        //Assegno l'id del nuovo pacchetto e aggiorno il counter
                        $id_pac[$r] = $num;
                        $num++;
                        
                        //Aggiorno la visualizzazione della riga per mostrare l'id
                        coloreRiga($r);
                        controlloAttivazioneBlocchi($r);
                        controlloAttivazioneTasti($r);
                    },
                    error: function()
                    {
                        alert("Non è stato possibile inserire i dati nel DB");
                    }
                });
                break;       
        }

        coloreRiga($r);
        controlloAttivazioneBlocchi($r);
        controlloAttivazioneTasti($r);

    });
    
    //Aggiunge le funzionalità dei tasti NO
    $( "body" ).on( "click", ".no", {}, function()
    {
        var $r = $(this).parents("tr").index()-1;
        switch ($(this).parent().attr("class"))
        {
            case 'risp': 
                if ($risp_tel[$r] != true)
                {
                    $risp_tel[$r] = false;
                    $.ajax({
                        type: "POST",
                        url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$r],
                            tasto: '$risp_tel[$r]',
                            comando: 'risp'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }
                    });
                }
                break;
            case 'mess': 
                if ($risp_mess[$r] != true)
                {
                    $risp_mess[$r] = false;
                    
                    $.ajax({
                        type: "POST",
                        url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$r],
                            tasto: $risp_mess[$r],
                            comando: 'mess'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }
                    });
                }
                break;
            case 'app':
                if ($fiss_app[$r] != true)
                {   
                    $fiss_app[$r] = false; 
                    
                    $.ajax({
                        type: "POST",
                        url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$r],
                            tasto: $fiss_app[$r],
                            comando: 'app'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }
                    });
                }
                break;
            case 'pacc':
                if ($vend_pac[$r] != true)
                {
                    $vend_pac[$r] = false;
                    
                    $.ajax({
                        type: "POST",
                        url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$r],
                            tasto: $vend_pac[$r],
                            comando: 'no_pacc'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }
                    });
                }
                break;       
        }

        coloreRiga($r);
        controlloAttivazioneBlocchi($r);
        controlloAttivazioneTasti($r);
    });
    
    //Previene l'inserimento di caratteri non numerici nel campo input
    //del numero di telefono del cliente
    $("body").on("input", "#insNumCliente", {}, function()
    {
        this.value = this.value.replace(/\D/g, ''); 
    });
    
    //Previene l'inserimento di caratteri numerici nel campo input
    //del nome del cliente
    $("body").on("input", "#insNomeCliente", {}, function()
    {
        this.value = this.value.replace(/(\d)/g, ''); 
    });
    
    //Aggiunge un nuovo cliente
    $("body").on("click","#submitCliente",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        
        //Prendo i valori dei campi di input
        var $inputField1 = $(this).siblings('.insNomeCliente').val();
        var $inputField2 = $(this).siblings('.insNumCliente').val();
        
        //Se nessuno dei campi è vuoto
        if ($inputField1.length > 0 && $inputField2.length >0)
        {
            //Salvo il nome del cliente
            $cliente[$index] = $inputField1 + " " + $inputField2;
            
            //Prelevo data e ora attuali, le formatto e le salvo
            var $now = dataOraAttuale();
            var $data = $now.split(" ")[0];
            var $ora = $now.split(" ")[1];
            $data_ora_ch[$index] = formattaDataOra($data, $ora);
            
            //Inserisco nel DB il nuovo cliente e prelevo il suo id univoco
            $.ajax({
                type: "POST",
                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                dataType: "text",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                data: {
                    cliente: $inputField1,
                    numero: $inputField2,
                    data_ch: $now,
                    comando: 'newApp'
                },
                success: function(id)
                {
                    $idApp[$index] = id;
                },
                error: function()
                {
                    alert("Non è stato possibile inserire i dati nel DB");
                }
            });
            
            coloreRiga($index);
            controlloAttivazioneBlocchi($index);
            controlloAttivazioneTasti($index);
        }
        else
        {
            alert("Input non valido.");
        }
    });
    
    //Inserisce la sede di riferimento per il cliente
    $("body").on("click","#submitSede",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $idSede = $(this).siblings("select").children("option:selected").val();
        $sede[$index] = $(this).siblings("select").children("option:selected").text();
        
        $.ajax({
            type: "POST",
            url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            
            data: {
                sede: $idSede,
                idApp: $idApp[$index],
                comando: 'insSede'
            },
            error: function()
            {
                alert("Non è stato possibile inserire i dati nel DB");
            }
        });

        coloreRiga($index);
        controlloAttivazioneBlocchi($index);
        controlloAttivazioneTasti($index);
    });
   
    //Aggiunge la data dell'appuntamento
    $("body").on("click","#submitData",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insApp').val();
        
        //Se l'input inserito non è vuoto
        if ($inputField.length > 0)
        {
            //Divido l'input in data e ora
            var $date = $inputField.split("T")[0];
            var $time = $inputField.split("T")[1];
            
            //Formatto la data e l'ora e le inserisco nell'array globale
            $data_ora_app[$index]= formattaDataOra($date, $time);
            
            //Riformatto data e ora nel formato SQL per l'inserimento
            var $data_app_db = $date + " " + $time;
            
            $.ajax({
                type: "POST",
                url:baseUrl+"index.php/GestioneClienti/AJAX_Call",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                
                data:
                {
                    idApp: $idApp[$index],
                    data_app: $data_app_db,
                    comando: 'insDataApp'
                },
                error: function()
                {
                    alert("Non è stato possibile inserire i dati nel DB");
                }
            });
            
            coloreRiga($index);
            controlloAttivazioneBlocchi($index);
            controlloAttivazioneTasti($index);
        }
        else
        {
            alert("Input non valido.");
        } 
    });
    
    //Aggiunge il nome dell'operatrice
    $("body").on("click","#submitNomeOp",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insNomeOp').val();
        
        //Se l'input non è vuoto
        if ($inputField.length > 0)
        {
            //Salvo il nome dell'operatrice nell'array globale
            $nome_op[$index] = $inputField;
            
            //Inserisco l'operatrice nel DB
            $.ajax({
                type: "POST",
                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                
                data: {
                    idApp: $idApp[$index],
                    op: $nome_op[$index],
                    comando: "insOp"
                },
                error: function()
                {
                    alert("Non è stato possibile inserire i dati nel DB");
                }
            });
            
            coloreRiga($index);
            controlloAttivazioneBlocchi($index);
            controlloAttivazioneTasti($index);
        }
        else
        {
            alert("Input non valido.");
        }
    });
    
    //Inserisce il trattamento da effettuare
    $("body").on("click","#submitNomeTrat",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insNomeTrat').val();
        
        //Se l'input inserito non è vuoto
        if ($inputField.length > 0)
        {
            //Salvo il nome del trattamento
            $trat[$index] = $inputField;
            
            //Inserisco il trattamento nel DB
            $.ajax({
                type: "POST",
                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                
                data: {
                    idApp: $idApp[$index],
                    trat: $trat[$index],
                    comando: "insTrat"
                },
                error: function()
                {
                    alert("Non è stato possibile inserire i dati nel DB");
                }
            });
            
            coloreRiga($index);
            controlloAttivazioneBlocchi($index);
            controlloAttivazioneTasti($index);
        }
        else
        {
            alert("Input non valido.");
        }
    });
  
    //Inserisce il nome del pacchetto venduto
    //OPPURE il motivo per cui non è stato venduto
    $("body").on("click","#submitNomePac",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insPac').val();
        
        //Se l'input non è vuoto
        if ($inputField.length > 0)
        {
            $nome_pac[$index] = $inputField;
            
            $.ajax({
                type: "POST",
                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                data: {
                    idApp: $idApp[$index],
                    nomePac: $nome_pac[$index],
                    comando: "insNomePac"
                },
                error: function()
                {
                    alert("Non è stato possibile inserire i dati nel DB");
                }
            });
            
            coloreRiga($index);
            controlloAttivazioneBlocchi($index);
            controlloAttivazioneTasti($index);
        }
        else
        {
            alert("Input non valido.");
        }
    });
    
   //Inserisce o aggiorna il campo nota
    $("body").on("click","#submitNota",{},function()
    {
        var $index = $(this).parents('tr').index()-1;

        //Se il campo nota è disabilitato
        if ($(this).siblings(":input[type='text']").attr("disabled"))
        {
            //Allora lo riabilito
            $(this).siblings(":input[type='text']").attr({disabled:false,hidden:false});
            
            //Nascondo il testo della nota mostrata in precedenza
            $("#notaText").empty();
            
            //Aggiorno il testo del tasto
            $(this).text("Inserisci");
        }
        //Se invece è attivo
        else
        {
            //Salvo il valore del campo nota
            var $inputField = $(this).siblings('.insNota').val();
            
            //Se non è vuoto
            if ($inputField.length > 0)
            {
                //Salvo la nota nell'array
                $nota[$index] = $inputField;
                
                //Salvo la nota nel DB
                $.ajax({
                    type: "POST",
                    url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    data:
                    {
                        idApp: $idApp[$index],
                        nota: $nota[$index],
                        comando: 'insNota'
                    },
                    error: function()
                    {
                        alert("Non è stato possibile inserire i dati nel DB");
                    }
                });

                coloreRiga($index);
                controlloAttivazioneBlocchi($index);
                controlloAttivazioneTasti($index);
            }
            else
            {
                alert("Input non valido");
            }
        }
    });
    
    //Attiva/disattiva i blocchi di campi di una riga dinamicamente
    function controlloAttivazioneBlocchi($r)
    {
        var $riga = $('tr').eq($r + 1);
        
        //Stampa la data di inserimento dell'operazione 
        if ($data_ora_ch[$r] != null)
        {
            $riga.find("td.chiamata").append().text($data_ora_ch[$r]);
        }
        
        //CONTROLLA INPUT "CLIENTE" E ATTIVAZIONE INPUT "TRATTAMENTO"
        if ($cliente[$r] != null)
        {
            $riga.find("td.nome").children().attr("hidden",true);
            $riga.find("td.nome").append().text($cliente[$r]);
            
            $riga.find(".nomeTrat input[type='text']").attr("disabled", false);
            $riga.find("#submitNomeTrat").attr("hidden",false);
        }
        else
        {
            $riga.find(".nomeTrat input[type='text']").attr("disabled", true);
            $riga.find("#submitNomeTrat").attr("hidden",true);
        }
        
        //CONTROLLA INPUT "TRATTAMENTO" E ATTIVAZIONE INPUT "SEDE"         
        if ($trat[$r] != null)
        {
            $riga.find("td.trat").append().text($trat[$r]);
            $riga.find(".nomeTrat input[type='text']").attr("hidden", true);
            $riga.find("#submitNomeTrat").attr("hidden",true);
            
            $riga.find("td.sede").children("select").attr("disabled",false);
            $riga.find("#submitSede").attr("hidden",false);
        }
        else
        {
            $riga.find("td.sede").children("select").attr("disabled",true);
            $riga.find("#submitSede").attr("hidden",true);
        }
        
        //CONTROLLA INPUT "SEDE" E ATTIVAZIONE TASTI "RISPOSTO" 
        if ($sede[$r] != null)
        {
            $riga.find("td.sede select").attr("hidden",true);
            $riga.find("td.sede button").attr("hidden",true);
            $riga.find("td.sede").append().text($sede[$r]);
            
            $riga.find("td.risp").children(".si, .no").attr("disabled",false).removeClass("notAvailable");
        }
        else
        {
            $riga.find("td.risp").children(".si, .no").attr("disabled",true).addClass("notAvailable");
        }
        
        //CONTROLLA ATTIVAZIONE TASTI "MESSAGGIO" E "FISSATO APP"
        if ($risp_tel[$r] == true)
        {
            $riga.find("td.mess").children(".si, .no").attr("disabled",true).addClass("notAvailable");
            $riga.find("td.app").children(".si, .no").attr("disabled",false).removeClass("notAvailable");
        }
        else if ($risp_tel[$r] == false)
        {
            $riga.find("td.mess").children(".si, .no").attr("disabled",false).removeClass("notAvailable"); 
            $riga.find("td.app").children(".si, .no").attr("disabled",true).addClass("notAvailable");
        }
        else
        {
            $riga.find("td.mess").children(".si, .no").attr("disabled",true).addClass("notAvailable");
            $riga.find("td.app").children(".si, .no").attr("disabled",true).addClass("notAvailable");
        }
        
        //CONTROLLA INPUT "NOTA"
        if ($nota[$r] != null)
        {
            $riga.find("td.nota").children(":input[type='text']").val($nota[$r]);

            $riga.find("#notaText").append().text($nota[$r]);
            $riga.find("td.nota").children(":input[type='text']").attr({disabled:true, hidden:true});
            $riga.find("td.nota").children("#submitNota").text("Modifica");
        }
        else
        {
            $riga.find("td.nota").children(":input[type='text']").attr({disabled:false, hidden:false});
            $riga.find("td.nota").children(":input[type='text']").val("");
            $riga.find("#notaText").empty();
            
            $riga.find("td.nota").children("#submitNota").text("Inserisci");
        }
        
        //CONTROLLA ATTIVAZIONE INPUT "DATA APP"
        if ($fiss_app[$r] == true)
        {
            $riga.find(":input[type='datetime-local']").attr("disabled",false);
            $riga.find("#submitData").attr("hidden", false);
        }
        else
        {
            $riga.find(":input[type='datetime-local']").attr("disabled",true);
            $riga.find("#submitData").attr("hidden", true);
        }
        
        //CONTROLLA INPUT "DATA APP" E ATTIVAZIONE TASTI "OPERATRICE"
        if ($data_ora_app[$r] != null)
        {
            $riga.find("#dataAppText").append().text($data_ora_app[$r]);
            $riga.find(":input[type='datetime-local']").attr("hidden",true);
            $riga.find("#submitData").attr("hidden", true);  
            
            $riga.find(".nomeOp input[type='text']").attr("disabled", false);
            $riga.find("#submitNomeOp").attr("hidden",false);
        }
        else
        {
            $riga.find("#dataAppText").empty();
            $riga.find(":input[type='datetime-local']").removeAttr("hidden");
            
            $riga.find(".nomeOp input[type='text']").attr("disabled", true);
            $riga.find("#submitNomeOp").attr("hidden",true);
        }
        
        //CONTROLLA INPUT "OPERATRICE" E ATTIVAZIONE CAMPO "VENDUTO PACC"
        if ($nome_op[$r] != null)
        {
            $riga.find("#opText").append().text($nome_op[$r]);
            $riga.find(".nomeOp input[type='text']").attr("hidden", true);
            $riga.find("#submitNomeOp").attr("hidden",true);
            
            $riga.find("td.pacc").children(".si, .no").attr("disabled",false).removeClass("notAvailable");
        }
        else
        {
            $riga.find("#opText").empty();
            $riga.find(".nomeOp input[type='text']").attr("hidden", false);
            
            $riga.find("td.pacc").children(".si, .no").attr("disabled",true).addClass("notAvailable");
        }
        
        //CONTROLLA INPUT "NOME PACC"
        if ($vend_pac[$r] == true)
        {            
            if ($nome_pac[$r] != null)
            {
                $riga.find("#nomePacText").append().text($nome_pac[$r]);
                $riga.find(".nomePac").attr("hidden",true);
                $riga.find(".nomePac input[type='text']").attr("disabled",true);
                $riga.find("td.pacc").children(".si, .no").attr("hidden",true);
            }
            else
            {
                $riga.find("#nomePacText").empty();
                $riga.find(".nomePac").attr("hidden",false);
                $riga.find(".nomePac input[type='text']").attr("disabled",false);
                $riga.find("td.pacc").children(".si, .no").attr("hidden",false);
            }
        }
        else if ($vend_pac[$r] == false)
        {
            if ($nome_pac[$r] != null)
            {
                $riga.find("#nomePacText").append().text($nome_pac[$r]);
                $riga.find(".nomePac").attr("hidden",true);
                $riga.find(".nomePac input[type='text']").attr("disabled",true);
                $riga.find("td.pacc").children(".si, .no").attr("hidden",false);
            }
            else
            {
                $riga.find("#nomePacText").empty();
                $riga.find(".nomePac").attr("hidden",false);
                $riga.find(".nomePac input[type='text']").attr("disabled",false);
                $riga.find("td.pacc").children(".si, .no").attr("hidden",false);
            }
        }
        else
        {
            $riga.find("#nomePacText").empty();
            $riga.find(".nomePac").attr("hidden",true);
            $riga.find(".nomePac input[type='text']").attr("disabled",true);
            $riga.find("td.pacc").children(".si, .no").attr("hidden",false);
        }
        
        //Stampa l'id progressivo dei pacchetti venduti
        if ($id_pac[$r] != null)
        {
            $riga.find("#idPacText").append().text($id_pac[$r]);
        }
        else
        {
            $riga.find("#idPacText").empty();
        }
    }
    
    //Riattiva i singoli tasti dei blocchi di tasti
    function controlloAttivazioneTasti(i)
    {
        var $riga = $('tr').eq(i + 1);
        
        if ($risp_tel[i] == true)
        {
            $riga.find('td.risp .si').attr("disabled",true);
            $riga.find('td.risp .no').attr("disabled",false);
        }
        else if ($risp_tel[i] == false)
        {
            $riga.find('td.risp .no').attr("disabled",true);
            $riga.find('td.risp .si').attr("disabled",false);
        }
        
        if ($risp_mess[i] == true)
        {
            $riga.find('td.mess .si').attr("disabled",true);
        }
        else if ($risp_mess[i] == false)
        {
            $riga.find('td.mess .no').attr("disabled",true);
        }
        
        if ($fiss_app[i] == true)
        {
            $riga.find('td.app .si').attr("disabled",true);
        }
        else if ($fiss_app[i] == false)
        {
            $riga.find('td.app .no').attr("disabled",true);
        }
        
        if ($vend_pac[i] == true)
        {
            $riga.find('td.pacc .si').attr("disabled",true);
        }
        else if ($vend_pac[i] == false)
        {
            $riga.find('td.pacc .no').attr("disabled",true);
        }
    }
    
    //Aggiorna il colore della riga passata 
    //e attiva/disattiva i campi data e testo
    function coloreRiga($r)
    {
        var $riga = $('tr').eq($r + 1);

        //Se esiste un appuntamento per la riga attuale
        if ($data_ora_ch[$r] != null)
        {
            //Se ancora non ho interagito con il cliente
            if ($risp_tel[$r] == null && $risp_mess[$r] == null)
            {
                $riga.css("background-color", "cyan");
                $riga.css("color", "black");
            }
            //Altrimenti se ho chiamato o inviato un messaggio al cliente
            else if ($risp_tel[$r] == true)
            {
                //Se ho fissato un appuntamento con il cliente
                if ($fiss_app[$r] == true)
                {
                    if ($vend_pac[$r] == true)
                    {
                        $riga.css("background-color", "DarkGreen");
                        $riga.css("color", "white");
                    }
                    else if ($vend_pac[$r] == false)
                    {
                        $riga.css("background-color", "DarkRed");
                        $riga.css("color", "white");
                    }
                    else
                    {
                        $riga.css("background-color", "greenyellow");
                        $riga.css("color", "black");
                    }
                }
                //Se ancora non l'ho fissato
                else
                {
                    $riga.css("background-color", "yellow");
                    $riga.css("color", "black");
                }
            }
            //Se il cliente non ha risposto a messaggi e chiamate
            else if ($risp_tel[$r] == false)
            {
                $riga.css("background-color", "orange");
                $riga.css("color", "black");
            }
        }
    }
    
    //Formatta data e ora dal formato datetime di MySQL o di HTML 
    //al formato italiano
    function formattaDataOra($data, $ora)
    {
        var $dataSplit = $data.split("-");
        
        var $anno = $dataSplit[0];
        var $mese = $dataSplit[1];
        var $giorno = $dataSplit[2];
        var $dataFormatted = $giorno + "-" + $mese + "-" + $anno;

        var $oraSplit = $ora.split(":");
        var $oraFormatted = $oraSplit[0] + ":" + $oraSplit[1];
        
        return $dataFormatted + " " + $oraFormatted;
    }
    
    //Recupera e formatta data e ora del giorno
    function dataOraAttuale()
    {
        var fullDate = new Date();

        //converto la data in formato yyyy-mm-gg
        var currentDate = fullDate.getFullYear() + "-" + 
                ("0" + (fullDate.getMonth() + 1)).slice(-2) + "-" + 
                ("0" + fullDate.getDate()).slice(-2) + " " + 
                ("0" + fullDate.getHours()).slice(-2) + ":" + 
                ("0" + fullDate.getMinutes()).slice(-2);
        
        return currentDate;
    }
 });   