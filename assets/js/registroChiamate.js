/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function()
{    
    
    //dichiaro gli array che conterranno i valori ottenuti dal db 
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
    
    //imposto gli array col valore dei risultati ottenuti dal model
    //length - 1 perché escludo la riga dell'header
    for(var i=0;i<$('tr').length-1;i++)
    {
        $idApp.push(results[i].id_app);
        $cliente.push(results[i].nome + " " + results[i].numero);
        
        //se è presente un id di sede ottengo il nome della sede dall'array di sedi
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
      
        //-------------------------------
        //formatto la data della chiamata
        var tData = results[i].data_ora_ch.split(" ")[0];
        var tOra = results[i].data_ora_ch.split(" ")[1];
        var $dataOra = formattaDataOra(tData, tOra);

        $data_ora_ch.push($dataOra);
        
        //formatto la data dell'appuntamento
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
    
    //counter dei pacchetti venduti
    if (lastPac != null)
    {
        $num = parseInt(lastPac) + 1;
    }
    else
    {
       $num = 1; 
    }
    
    //attiva la creazione di una nuova riga
    $('button.addUser').click(function()
    {
        var $i = $('#clienti tr').length - 1;
        $("#noClienti").attr("hidden",true);
        $('#clienti tr').eq($i).after(nuovaRiga);
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
        
        controlloAttivazioneBlocchi($i);
        controlloAttivazioneTasti($i);
        
        $('#clienti tr')[$i].scrollIntoView();
    });
    
    $('#filtraSede').change(function()
    {
        
       var filtro = $(this).children("option:selected").val();
       
       $("td").parent().remove();
       
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
        
        var $i = 0;
        
        if (filtro == 'all')
        {
            $.ajax({
                type: "POST",
                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                async: false,
                data: {
                    comando: 'getClienti'
                },
                success: function(json){
                    results = JSON.parse(json);
                },
                error: function()
                {
                    alert("Non è stato possibile inserire i dati nel DB");
                }

            });
        }
        else
        {
            $.ajax({
                type: "POST",
                url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                async: false,
                data: {
                    comando: 'getClientiFiltrati',
                    sede: filtro
                },
                success: function(json){
                    results = JSON.parse(json);
                },
                error: function()
                {
                    alert("Non è stato possibile inserire i dati nel DB");
                }

            });
        }
        
        
        $.each(results, function(index,res)
        {
            
            $('button.addUser').click();
            $idApp.push(res.id_app);
            $cliente[$i]= res.nome + " " + res.numero;
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

            //-------------------------------
            //formatto la data della chiamata
            var tData = res.data_ora_ch.split(" ")[0];
            var tOra = res.data_ora_ch.split(" ")[1];
            var $dataOra = formattaDataOra(tData, tOra);

            $data_ora_ch[$i] = $dataOra;

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


            coloreRiga($i);
            controlloAttivazioneBlocchi($i);
            controlloAttivazioneTasti($i);
            $i++;
            
        });
        
        
       
    });
    
    //aggiunge le funzionalità dei tasti SI
    $( "body" ).on( "click", ".si", {}, function()
    {
        var $r = $(this).parents("tr").index()-1;
        //aggiorno il valore dei tasti
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
                        $id_pac[$r] = $num
                        $num++;
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
    
    //aggiunge le funzionalità dei tasti NO
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
                            tasto: $risp_tel[$r],
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
    
    $("body").on("input", "#insNumCliente", {}, function()
    {
        this.value = this.value.replace(/\D/g, ''); 
    });
    
    $("body").on("input", "#insNomeCliente", {}, function()
    {
        this.value = this.value.replace(/(\d)/g, ''); 
    });
    
    $("body").on("click","#submitCliente",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField1 = $(this).siblings('.insNomeCliente').val();
        var $inputField2 = $(this).siblings('.insNumCliente').val();
        if ($inputField1.length > 0 && $inputField2.length >0)
        {
            //salva nome pacchetto, stampalo e nascondi input field e tasti
            $cliente[$index] = $inputField1 + " " + $inputField2;
            var $now = dataOraAttuale();
            var $data = $now.split(" ")[0];
            var $ora = $now.split(" ")[1];
            $data_ora_ch[$index] = formattaDataOra($data, $ora);
            
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
    
    
    //aggiunge la data dell'appuntamento
    $("body").on("click","#submitData",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insApp').val();
        if ($inputField.length > 0)
        {
            var $date = $inputField.split("T")[0];
            var $time = $inputField.split("T")[1];
            
            //salva data e ora, dividile, stampale e nascondi input field e tasti
            $data_ora_app[$index]= formattaDataOra($date, $time);
            
            //inserisce la data dell'appuntamento nel db
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
    
    $("body").on("click","#submitNota",{},function()
    {
        alert("nota");
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insNota').val();
        if ($inputField.length > 0)
        {
            $nota[$index] = $inputField;
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
    });
    
    
    $("body").on("click","#submitNomeOp",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insNomeOp').val();
        if ($inputField.length > 0)
        {
            //salva nome pacchetto, stampalo e nascondi input field e tasti
            $nome_op[$index] = $inputField;
            
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
    
    
    $("body").on("click","#submitNomeTrat",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insNomeTrat').val();
        if ($inputField.length > 0)
        {
            //salva nome pacchetto, stampalo e nascondi input field e tasti
            $trat[$index] = $inputField;
            
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
  
    $("body").on("click","#submitNomePac",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        var $inputField = $(this).siblings('.insPac').val();
        if ($inputField.length > 0)
        {
            //salva nome pacchetto, stampalo e nascondi input field e tasti
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
    
    $("body").on("click","#delButton",{},function()
    {
        var $index = $(this).parents('tr').index()-1;
        
         $.ajax({
            type: "POST",
            url: baseUrl+"index.php/GestioneClienti/AJAX_Call",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            data: {
                idApp: $idApp[$index],
                comando: "resetRiga"
            },
            success: function()
            {
                
                
            },
            error: function()
            {
                alert("Non è stato possibile eliminare la riga");
            }
        });
        
        $risp_tel[$index] = null;
        $risp_mess[$index] = null;
        $nota[$index] = null;
        $fiss_app[$index] = null;
        $data_ora_app[$index] = null;
        $vend_pac[$index] = null;

        //se era l'ultimo pacchetto "venduto" decremento perché non l'ho mai realmente venduto
        if ($id_pac == $num-1)
        {
            $num--;
        }
        $id_pac[$index] = null;
        $nome_op[$index] = null;
        $nome_pac[$index] = null;
        coloreRiga($index);
        controlloAttivazioneBlocchi($index);
        controlloAttivazioneTasti($index);
        
        
    });
    
    //attiva o disattiva i blocchi di tasti dinamicamente
    function controlloAttivazioneBlocchi($r)
    {
        var $riga = $('tr').eq($r + 1);
        
        //stampa la data di inserimento dell'operazione 
        if ($data_ora_ch[$r] != null)
        {
            $riga.find("td.chiamata").append().text($data_ora_ch[$r]);
        }
        
        //CONTROLLA INPUT "CLIENTE" E ATTIVAZIONE INPUT "TRATTAMENTO"
        //-----------------------------
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
        //-------------------------------
        
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
        //-----------------------------
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
        //-----------------------------
        if ($risp_tel[$r] == true)
        {
            $riga.find("td.mess").children(".si, .no").attr("disabled",true).addClass("notAvailable");
            $riga.find("td.app").children(".si, .no").attr("disabled",false).removeClass("notAvailable");
        }
        else if ($risp_tel[$r] == false)
        {
            $riga.find("td.mess").children(".si, .no").attr("disabled",false).removeClass("notAvailable"); 
            if ($risp_mess[$r] == true)
            {
                $riga.find("td.app").children(".si, .no").attr("disabled",false).removeClass("notAvailable");
            }
            else
            {
                $riga.find("td.app").children(".si, .no").attr("disabled",true).addClass("notAvailable");
            }
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
            $riga.find("td.nota").children("#submitNota").text("Inserisci");
        }
        else
        {
            $riga.find("td.nota").children(":input[type='text']").val("");
        }
        
        //CONTROLLA ATTIVAZIONE INPUT "DATA APP"
        //-----------------------------
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
        //----------------------------------
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
            $riga.find("#submitData").removeAttr("hidden"); 
            
            $riga.find(".nomeOp input[type='text']").attr("disabled", true);
            $riga.find("#submitNomeOp").attr("hidden",true);
        }
        

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
            $riga.find("#submitNomeOp").attr("hidden",false);
            
            $riga.find("td.pacc").children(".si, .no").attr("disabled",true).addClass("notAvailable");
        }
        
        
        //CONTROLLA INPUT "VENDUTO PACC" E VALORE "NUM PACC"
        if ($vend_pac[$r] == true)
        {            
            if ($nome_pac[$r] != null)
            {
                $riga.find("#nomePacText").append().text($nome_pac[$r]);
                $riga.find(".nomePac").attr("hidden",true);
                $riga.find(".nomePac input[type='text']").attr("disabled",true);
            }
            else
            {
                $riga.find("#nomePacText").empty();
                $riga.find(".nomePac").attr("hidden",false);
                $riga.find(".nomePac input[type='text']").attr("disabled",false);
            }
        }
        else
        {
            $riga.find("#nomePacText").empty();
            $riga.find(".nomePac").attr("hidden",true);
            $riga.find(".nomePac input[type='text']").attr("disabled",true);
        }
        
        if ($id_pac[$r] != null)
        {
            $riga.find("#idPacText").append().text($id_pac[$r]);
        }
        else
        {
            $riga.find("#idPacText").empty();
        }
        
    }
    
    //riattiva i singoli tasti dei blocchi di tasti
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
    
    //aggiorna il colore della riga passata e attiva/disattiva i campi data e testo
    function coloreRiga($r)
    {
        var $riga = $('tr').eq($r + 1);
        
        if ($data_ora_ch[$r] != null)
        {
            //se ancora non ho interagito con il cliente
            if ($risp_tel[$r] == null && $risp_mess[$r] == null)
            {
                $riga.css("background-color", "cyan");
            }
            //altrimenti se ho chiamato o inviato un messaggio al cliente
            else if ($risp_tel[$r] == true || $risp_mess[$r] == true)
            {
                //se ho fissato un appuntamento con il cliente
                if ($fiss_app[$r] == true)
                {
                    $riga.css("background-color", "greenyellow");
                }
                //se ancora non l'ho fatto
                else
                {
                    $riga.css("background-color", "yellow");
                }
            }
            //se il cliente non ha risposto a messaggi e chiamate
            else
            {
                $riga.css("background-color", "orange");
            }
        }
    }
    
    //formatta data e ora dal formato datetime di MySQL o di HTML al formato italiano o viceversa
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
    
    function formattaDataOraToSQL($data, $ora)
    {
        var $dataSplit = $data.split("-");
        
        var $giorno = $dataSplit[0];
        var $mese = $dataSplit[1];
        var $anno = $dataSplit[2];
        
        var $dataFormatted = $anno + "-" + $mese + "-" + $giorno;

        var $oraSplit = $ora.split(":");
        var $oraFormatted = $oraSplit[0] + ":" + $oraSplit[1];
        
        return $dataFormatted + " " + $oraFormatted;
    }
    
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


