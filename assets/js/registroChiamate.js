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
    //$idSede = [];
    $risp_tel = [];
    $risp_mess = [];
    $fiss_app = [];
    $vend_pac = [];
    $data_ora_ch = [];
    $data_ora_app = [];
    $nome_op = [];
    $trat = [];
    $nome_pac = [];
    $id_pac = [];
    
    //imposto gli array col valore dei risultati ottenuti dal model
    //e imposto il colore iniziale di ogni riga;
    //length - 1 perché escludo la riga dell'header
    for(i=0;i<$('tr').length-1;i++)
    {
        $idApp.push(results[i].id_app);
        $cliente.push(results[i].nome + " " + results[i].numero);
        
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
        $fiss_app.push(results[i].fiss_app);
        $vend_pac.push(results[i].vend_pac);
      
        //-------------------------------
        //formatto la data della chiamata
        var tData = results[i].data_ora_ch.split(" ")[0];
        var tOra = results[i].data_ora_ch.split(" ")[1];
        var $dataOra = formattaDataOra(tData, tOra);

        $data_ora_ch.push($dataOra);
        
        if (results[i].data_ora_app == null)
            $data_ora_app.push(null);
        else
        {
            alert(results[i].data_ora_app);
            var tData = results[i].data_ora_app.split(" ")[0];
            var tOra = results[i].data_ora_app.split(" ")[1];
            var $dataOra = formattaDataOra(tData, tOra);
            
            $data_ora_app.push($dataOra);
        }
       
        
//        $idSede.push(results[i].id_sede);
        $nome_pac.push(results[i].nome_pacc);
        $id_pac.push(results[i].id_pacc);
        $nome_op.push(results[i].operatrice);
        $trat.push(results[i].trattamento);
        
        
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
        $('#clienti tr').eq($i).after(nuovaRiga);
        $idApp.push(null);
        $cliente.push(null);
        $risp_tel.push(null);
        $risp_mess.push(null);
        $fiss_app.push(null);
        $vend_pac.push(null);
        $data_ora_ch.push(null);
        $data_ora_app.push(null);
//        $idSede.push(null);
        $nome_pac.push(null);
        $id_pac.push(null);
        $nome_op.push(null);
        $trat.push(null);
        $sede.push(null);
        
//        $i++;
        controlloAttivazioneBlocchi($i);
    });
    
    //aggiunge le funzionalità dei tasti SI
    $( "body" ).on( "click", ".si", {}, function()
    {
        var $row_index = $(this).parents("tr").index()-1;
        //aggiorno il valore dei tasti
        switch ($(this).parent().attr("class"))
        {
            case 'risp': 
                $risp_tel[$row_index] = true; 
                $.ajax({
                        type: "POST",
                        url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$row_index],
                            tasto: $risp_tel[$row_index],
                            comando: 'risp'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }

                    });
//                    updateChiamata($idCliente[$row_index],$idSede[$row_index],$data_ora_ch[$row_index],'risp',$risp_tel[$row_index]);
                break;
            case 'mess': 
                $risp_mess[$row_index] = true; 
                $.ajax({
                        type: "POST",
                        url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$row_index],
                            tasto: $risp_mess[$row_index],
                            comando: 'mess'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }

                    });
//                    updateChiamata($idCliente[$row_index],$idSede[$row_index],$data_ora_ch[$row_index],'mess',$risp_mess[$row_index]);
                break;
            case 'app':
                $fiss_app[$row_index] = true; 
                $.ajax({
                        type: "POST",
                        url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$row_index],
                            tasto: $fiss_app[$row_index],
                            comando: 'app'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }

                    });
//                    updateChiamata($idCliente[$row_index],$idSede[$row_index],$data_ora_ch[$row_index],'app',$fiss_app[$row_index]);
                break;
            case 'pacc':
                $vend_pac[$row_index] = true;
                
                $.ajax({
                        type: "POST",
                        url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$row_index],
                            tasto: $vend_pac[$row_index],
                            idPac: $num,
                            comando: 'si_pacc'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }

                    });
//                    var val = {"pac": $vend_pac[$row_index], "id": $num, "dataora_app": formattaDataOraToSQL($data_ora_app[$row_index].split(" ")[0],$data_ora_app[$row_index].split(" ")[1])};
//                    updateChiamata($idCliente[$row_index],$idSede[$row_index],$data_ora_ch[$row_index],'pacc',val);
                inserimentoNumPacchetto($row_index);
                break;       
        }

        coloreRiga($row_index);
        controlloAttivazioneBlocchi($row_index);
        controlloAttivazioneTasti($row_index);

    });
    
    //aggiunge le funzionalità dei tasti NO
    $( "body" ).on( "click", ".no", {}, function()
    {
        var $row_index = $(this).parents("tr").index()-1;
        switch ($(this).parent().attr("class"))
        {
            case 'risp': 
                if ($risp_tel[$row_index] != true)
                {
                    $risp_tel[$row_index] = false;
                    $.ajax({
                        type: "POST",
                        url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$row_index],
                            tasto: $risp_tel[$row_index],
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
                if ($risp_mess[$row_index] != true)
                {
                    $risp_mess[$row_index] = false;
                    
                    $.ajax({
                        type: "POST",
                        url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$row_index],
                            tasto: $risp_mess[$row_index],
                            comando: 'mess'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }

                    });
//                        updateChiamata($idCliente[$row_index],$idSede[$row_index],$data_ora_ch[$row_index],'mess',$risp_mess[$row_index]);break;
                }
                break;
            case 'app':
                if ($fiss_app[$row_index] != true)
                {   
                    $fiss_app[$row_index] = false; 
                    
                    $.ajax({
                        type: "POST",
                        url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$row_index],
                            tasto: $fiss_app[$row_index],
                            comando: 'app'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }

                    });
//                        updateChiamata($idCliente[$row_index],$idSede[$row_index],$data_ora_ch[$row_index],'app',$fiss_app[$row_index]);
                }
                break;
            case 'pacc':
                if ($vend_pac[$row_index] != true)
                {
                    $vend_pac[$row_index] = false;
                    
                    $.ajax({
                        type: "POST",
                        url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {
                            idApp: $idApp[$row_index],
                            tasto: $vend_pac[$row_index],
                            comando: 'no_pacc'
                        },
                        error: function()
                        {
                            alert("Non è stato possibile inserire i dati nel DB");
                        }

                    });
//                        updateChiamata($idCliente[$row_index],$idSede[$row_index],$data_ora_ch[$row_index],'pacc',$vend_pac[$row_index]);
                }
                break;       
        }

        coloreRiga($row_index);
        controlloAttivazioneBlocchi($row_index);
        controlloAttivazioneTasti($row_index);
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
                url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
                dataType: "json",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                data: {
                    cliente: $inputField1,
                    numero: $inputField2,
                    data_ch: $now,
                    comando: 'newApp'
                },
                success: function(json)
                {
                    $idApp[$index] = json;
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
            url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
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
            //updateAppuntamento($idCliente[$index], $idSede[$index], "insApp", $data_app_db);
            
            $.ajax({
                type: "POST",
                url:"http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
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
                url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
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
                url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
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
            
            //var val = { "dataora": formattaDataOraToSQL(tData,tOra), "nome": $inputField};
            //updateAppuntamento($idCliente[$index], $idSede[$index], "nomePacc", val);
            
            $.ajax({
                type: "POST",
                url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Call",
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
    
    
    //imposta un numero progressivo per ogni pacchetto venduto
    function inserimentoNumPacchetto($row_index)
    {
        $('tr').eq($row_index + 1).find(".idPacc").append().text($num);
        $num++;
    }
    

    //attiva o disattiva i blocchi di tasti dinamicamente
    function controlloAttivazioneBlocchi($r)
    {
        var $riga = $('tr').eq($r + 1);
        
        if ($data_ora_ch[$r] != null)
        {
            $riga.find("td.chiamata").append().text($data_ora_ch[$r]);
        }
        //CONTROLLA INPUT "CLIENTE" E ATTIVAZIONE TASTI "SEDE"
        //-----------------------------
        if ($cliente[$r] != null)
        {
            $riga.find("td.nome").children().attr("hidden",true);
            $riga.find("td.nome").append().text($cliente[$r]);
            
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
            $riga.find("td.mess").children(".si, .no").attr("disabled",false).removeClass("notAvailable"); //QUESTA RIGA RIMUOVE ANCHE LA DISATTIVAZIONE NECESSARIA
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
        
        
        //CONTROLLA ATTIVAZIONE TASTI "DATA APP"
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
            $riga.find("td.data").append().text($data_ora_app[$r]);
            $riga.find(":input[type='datetime-local']").attr("hidden",true);
            $riga.find("#submitData").attr("hidden", true);  
            
            $riga.find(".nomeOp input[type='text']").attr("disabled", false);
            $riga.find("#submitNomeOp").attr("hidden",false);
        }
        else
        {
            $riga.find(".nomeOp input[type='text']").attr("disabled", true);
            $riga.find("#submitNomeOp").attr("hidden",true);
        }
        
        //CONTROLLA ATTIVAZIONE TASTI "TRATTAMENTO"
        //--------------------------------------
        if ($nome_op[$r] != null)
        {
            $riga.find("td.op").append().text($nome_op[$r]);
            $riga.find(".nomeOp input[type='text']").attr("hidden", true);
            $riga.find("#submitNomeOp").attr("hidden",true);
            
            $riga.find(".nomeTrat input[type='text']").attr("disabled", false);
            $riga.find("#submitNomeTrat").attr("hidden",false);
        }
        else
        {
            $riga.find(".nomeTrat input[type='text']").attr("disabled", true);
            $riga.find("#submitNomeTrat").attr("hidden",true);
        }
        
        //CONTROLLA ATTIVAZIONE TASTI "VENDUTO PACC"
        //-------------------------------------------
        if ($trat[$r] != null)
        {
            $riga.find("td.trat").append().text($trat[$r]);
            $riga.find(".nomeTrat input[type='text']").attr("hidden", true);
            $riga.find("#submitNomeTrat").attr("hidden",true);
            
            $riga.find("td.pacc").children(".si, .no").attr("disabled",false).removeClass("notAvailable");
        }
        else
        {
            $riga.find("td.pacc").children(".si, .no").attr("disabled",true).addClass("notAvailable");
        }
        
        //CONTROLLA INPUT "VENDUTO PACC" E VALORE "NUM PACC"
        if ($vend_pac[$r] == true)
        {            
            if ($nome_pac[$r] != null)
            {
                $riga.find(".nomePac").attr("hidden",true);
                $riga.find(".nomePac input[type='text']").attr("disabled",true);
                $riga.find("td.pacc").append().text($nome_pac[$r]);
            }
            else
            {
                $riga.find(".nomePac").attr("hidden",false);
                $riga.find(".nomePac input[type='text']").attr("disabled",false);
            }
//            $riga.find("td.idPacc").append().text($id_pac[$r]);
        }
        else
        {
            $riga.find(".nomePac").attr("hidden",true);
            $riga.find(".nomePac input[type='text']").attr("disabled",true);
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
    function coloreRiga($row_index)
    {
        var $riga = $('tr').eq($row_index + 1);
        
        if ($data_ora_ch[$row_index] != null)
        {
            //se ancora non ho interagito con il cliente
            if ($risp_tel[$row_index] == null && $risp_mess[$row_index] == null)
            {
                $riga.css("background-color", "cyan");
            }
            //altrimenti se ho chiamato o inviato un messaggio al cliente
            else if ($risp_tel[$row_index] == true || $risp_mess[$row_index] == true)
            {
                //se ho fissato un appuntamento con il cliente
                if ($fiss_app[$row_index] == true)
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

    
    
//    function updateAppuntamento($cliente, $sede, $comando, $valore)
//    {
//        $.ajax({
//            type: "POST",
//            url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Appuntamento",
//            data: {
//                cliente: $cliente,
//                sede: $sede,
//                comando: $comando,
//                valore: $valore
//            },
//            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//            error: function()
//            {
//                alert("Non è stato possibile inserire i dati nel DB");
//            }
//        });
//    }
//    
//    //Passa i dati relativi alla richiesta al controller, che la smista effettuando la giusta richiesta al Model
//    function updateChiamata($cliente, $sede, $data_ora_ch, $comando, $valore)
//    {
//        $.ajax({
//           type: "POST",
//           url: "http://localhost/appmanager/index.php/GestioneClientiController/AJAX_Chiamata",
//           data: {
//                cliente: $cliente,
//                sede: $sede,
//                data_ora_ch: $data_ora_ch,
//                comando: $comando,
//                valore: $valore
//           },
//           contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//           error: function(request,status,error){
//               alert("Non è stato possibile inserire i dati nel DB " + error);
//           }
//        });
//    }
    
    
 });   


