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
            #filtro{
                display: inline;
                margin-left: 20px;
            }
        </style>
        
    </head>
    <body>
        <?php
            $items = "";
            foreach($sedi as $s)
            {
                $items.="<option value='".$s->id_sede."'>".$s->indirizzo."</option>";
            }
            $selectSede = "<select>".$items."</select>";

        
            $filtraSede = "<select id='filtraSede'><option value='all'>Tutte</option>".$items."</select>";
        
            if (count($appuntamenti) == 0)
            {
                echo "<div id='noClienti'>Nessun cliente ha chiamato.<br></div>";
            }
            echo "<button class='addUser'>Aggiungi operazione</button>";
            echo "<div id='filtro'>Filtra per sede: ".$filtraSede."</div>";
            //creo una tabella per contenere i dati
            echo "<table id='clienti'>";
                
                //creo l'header della tabella
                echo"<tr>";
                    echo "<th>Data inserimento</th>";
                    echo "<th>Cliente</th>";
                    echo "<th>Trattamento</th>";
                    echo "<th>Sede</th>";
                    echo "<th>Risposto</th>";
                    echo "<th>Messaggio</th>";
                    echo "<th>Fissato app</th>";
                    echo "<th>Data/Ora app</th>";
                    echo "<th>Operatrice</th>";
                    echo "<th>Pacc venduto</th>";
                    echo "<th>Num pacc</th>";
                echo "</tr>";
               
            if (count($appuntamenti) > 0)   
            {
                
                //creo una riga per ogni record ottenuto dal db
                foreach ($appuntamenti as $row)
                {
                    //preparo i dati per la gestione e l'output
                    $array['idApp'] = $row->id_app;
                    $chiamataFormatted = new DateTime($row->data_ora_ch);
                    $array['chiamata'] = $chiamataFormatted;
                    $array['nome'] = "$row->nome $row->numero";
                    $array['trat'] = $row->trattamento;
                    $array['sede'] = $row->sede;
                    $array['risp'] = $row->risp_tel;
                    $array['mess'] = $row->risp_mess;
                    $array['app'] = $row->fiss_app;
                    $array['data'] = $row->data_ora_app;
                    $array['op'] = $row->operatrice;
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
                                echo "<label for='insNomeCliente'>Nome</label>";
                                echo "<input type='text' class='insNomeCliente' id='insNomeCliente' required><br>";
                                echo "<label for='insNumCliente'>Numero</label>";
                                echo "<input type='text' class='insNumCliente'id='insNumCliente' required><br>";
                                echo "<button type='button' id='submitCliente'>Inserisci</button>";
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
                                echo "<button class='si'>SI</button>";
                                echo "<button class='no'>NO</button>";

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
                                   
            }
            echo "</table>"; 
        
        //definisco la struttura di una riga per l'inserimento di un nuovo appuntamento
            
        $riga="<tr>
            <td class='chiamata'></td>
            
            <td class='nome'>
                <form class='nomeCliente'>
                    <label for='insNomeCliente'>Nome</label>
                    <input type='text' class='insNomeCliente' id='insNomeCliente' required><br>
                    <label for='insNumCliente'>Numero</label>
                    <input type='text' class='insNumCliente' id='insNumCliente' required><br>
                    <button type='button' id='submitCliente'>Inserisci</button>
                </form>
            </td>
            
            <td class='trat'>
                <form class='nomeTrat'>
                    <input type='text' class='insNomeTrat' required>
                    <button type='button' id='submitNomeTrat'>Inserisci</button>
                </form>
            </td>
            
            <td class='sede'>".$selectSede."
                <button type='button' id='submitSede'>Inserisci</button>
            </td>
            
            <td class='risp'>
                <button class='si'>SI</button>
                <button class='no'>NO</button>
            </td>
            
            <td class='mess'>
                <button class='si'>SI</button>
                <button class='no'>NO</button>
            </td>
            
            <td class='app'>
                <button class='si'>SI</button>
                <button class='no'>NO</button>
            </td>
            
            <td class='data'>
                <form class='dataApp'>
                    <input type='datetime-local' class='insApp' id='dataApp' required>
                    <button type='button' id='submitData'>Inserisci</button>
                </form>
            </td>
            
            <td class='op'>
                <form class='nomeOp'>
                    <input type='text' class='insNomeOp' required>
                    <button type='button' id='submitNomeOp'>Inserisci</button>
                </form>
            </td>
            
            <td class='pacc'>
                <button class='si'>SI</button>
                <button class='no'>NO</button>
                <form class='nomePac'>
                    <input type='text' class='insPac' id='nomePac' required>
                    <button type='button' id='submitNomePac'>Inserisci</button>
                </form>
            </td>
            
            <td class='idPacc'></td>
        </tr>";
        
        ?>
        <script> 
            //converto le variabili php in oggetti json gestibili da JS
            var listaSedi = <?php echo json_encode($sedi); ?>;
            var results = <?php echo json_encode($appuntamenti); ?>;
            var lastPac = <?php echo json_encode($ultimoPacc); ?>;
            var nuovaRiga = <?php echo json_encode($riga); ?>;
            //infine carico JQuery e lo script di gestione del registro
        </script>
        <script src="<?php echo base_url()."assets/js/jquery-3.4.0.js"?>"></script>
        <script src="<?php echo base_url()."assets/js/registroChiamate.js"?>"></script>
    </body>
</html>
