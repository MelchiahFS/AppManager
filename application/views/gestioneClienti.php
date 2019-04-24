<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->


<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            table {
                width: 100%
            }
            table, th, td {
              border: 1px solid black;
            }
            table tr th{
                background-color: #98dbcc;
            }
            button, button#submitData, button#submitNomePac{
                background-color: blue;
                color: white;
            }
            button:disabled{
                background-color: white;
                color: blue;
            }
            button:disabled.notAvailable{
                background-color: lightgray;
                color: black;
            }
        </style>
        
    </head>
    <body>
        <?php
            if ($clienti->num_rows() == 0)
            {
                echo "Nessun cliente ha chiamato.";
                echo "<button class='addUser'>Aggiungi operazione</button>";
            }
            else    
            {
                echo "<button class='addUser'>Aggiungi operazione</button>";
                //creo una tabella per contenere i dati
                echo "<table id='clienti'>";
                
                //creo l'header della tabella
                echo"<tr>";
                    echo "<th>Data inserimento</th>";
                    echo "<th>Cliente</th>";
                    echo "<th>Sede</th>";
                    echo "<th>Risposto</th>";
                    echo "<th>Messaggio</th>";
                    echo "<th>Fissato app</th>";
                    echo "<th>Data/Ora app</th>";
                    echo "<th>Operatrice</th>";
                    echo "<th>Trattamento</th>";
                    echo "<th>Pacc venduto</th>";
                    echo "<th>Num pacc</th>";
                echo "</tr>";
                
                foreach($sedi as $s)
                {
                    $items.="<option value='$s'>$s</option>";
                }
                $selectSede = "<select>".$items."</select>";
                
                //creo una riga per ogni record ottenuto dal db
                foreach ($appuntamenti as $row)
                {
                    //preparo i dati per la gestione e l'output
                    $array['idApp'] = $row->id_app;
                    $chiamataFormatted = new DateTime($row->data_ora_ch);
                    $array['chiamata'] = $chiamataFormatted;
                    $array['nome'] = "$row->nome $row->numero";
                    $array['sede'] = $row->sede;
                    $array['risp'] = $row->risp_tel;
                    $array['mess'] = $row->risp_mess;
                    $array['app'] = $row->fiss_app;
                    $array['data'] = $row->data_ora_app;
                    $array['op'] = $row->operatrice;
                    $array['trat'] = $row->trattamento;
                    $array['pacc'] = $row->vend_pac;
                    $array['idPacc'] = $row->id_pacc;
                    $array['nomePacc'] = $row->nome_pacc;
                    
                    
                    echo "<tr>";
                        
                        
                    //imposto le varie celle con valori o tasti
                    foreach($array as $key => $value)
                    {
                        if ($key != "nomePacc" && $key != "idApp")
                        {
                            echo "<td class='$key'>";
                            //se la colonna è relativa alla data di appuntamento
                            if ($key == "data")
                            {
                                //inserisco il form per l'inserimento della data e l'ora dell'appuntamento
                                echo "<form class='dataApp'><input type='datetime-local' class='insApp' id='dataApp' required>";
                                echo "<button type='button' id='submitData'>Inserisci</button>";
                                echo "</form>";
                            }
                            else if ($key == "nome")
                            {
                                echo "<form class='nomeCliente'>";
                                echo "<input type='text' class='insNomeCliente' required>";
                                echo "<input type='text' class='insNumCliente' required>";
                                echo "<button type='button' id='submitNomeCliente'>Inserisci</button>";
                                echo "</form>";
                            }
                            else if ($key == "op")
                            {
                                echo "<form class='nomeOp'>";
                                echo "<input type='text' class='insNomeOp' required>";
                                echo "<button type='button' id='submitNomeOp'>Inserisci</button>";
                                echo "</form>";
                            }
                            else if ($key == "trat")
                            {
                                echo "<form class='nomeTrat'>";
                                echo "<input type='text' class='insNomeTrat' required>";
                                echo "<button type='button' id='submitNomeTrat'>Inserisci</button>";
                                echo "</form>";
                            }
                            //se è relativa ai dati del cliente o al numero del pacchetto venduto
                            else if ($key == "idPacc")
                            {
                                //stampo il valore
                                echo $value;
                            }
                            else if ($key == 'chiamata')
                            {
                                echo $value->format('d-m-Y H:i');
                            }
                            else if ($key == 'sede')
                            {
                                echo $selectSede;
                                echo "<button type='button' id='submitSede'>Inserisci</button>";
                            }
                            //negli altri casi inserisco due tasti SI e NO
                            else
                            {
                                echo "<button class='si' ";
                                echo ">SI</button>";
                                echo "<button class='no'";
                                echo ">NO</button>";

                                //se la colonna è relativa alla vendita del pacchetto
                                if ($key == "pacc")
                                {
                                    //permetto di inserire il nome del pacchetto mostrando un campo input testuale
                                    echo "<form class='nomePac'><input type='text' class='insPac' id='nomePac' required>";
                                    echo "<button type='button' id='submitNomePac'>Inserisci</button>";
                                    echo"</form>";
                                }
                            }
                            echo "</td>";
                        }
                    }
                    echo "</tr>";
                    
                }
                echo "</table>";                    
            }
        ?>
        <script> 
            //converto le variabili php in oggetti json gestibili da JS
            var results = <?php echo json_encode($clienti); ?>;
            var lastPac = <?php echo json_encode($ultimoPacc); ?>;
            //infine carico JQuery e lo script di gestione del registro
        </script>
        <script src="<?php echo base_url()."assets/js/jquery-3.4.0.js"?>"></script>
        <script src="<?php echo base_url()."assets/js/registroChiamate.js"?>"></script>
    </body>
</html>
