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
            table{
                clear:both;
            }
            th{
                position:sticky;
                top:0;
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
            #filtro{
                display: inline;
                margin-left: 20px;
            }
            button#delButton{
                background: url(assets/icons/x-mark.ico);
                background-color: white;
                width: 30px; height: 30px;
                background-size: cover
            }
            
            ul{
                list-style:none;
                float:right;
                padding-left: 0;
                margin-left: 0;
            }
            
            fieldset{
                float:right;
                padding-top:10px;
                padding-bottom:10px;
                margin-bottom:10px;
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
        ?>
            <fieldset>
            <legend>Legenda colori:</legend>
            <ul>
              <li><span style="background-color: greenyellow; width:20px; height:20px; display:inline-block;"></span> Fissato appuntamento
              <li><span style="background-color: darkgreen; width:20px; height:20px; display:inline-block;"></span> Pacchetto venduto
              <li><span style="background-color: darkred; width:20px; height:20px; display:inline-block;"></span> Pacchetto non venduto
            </ul>
            
            <ul>
              <li><span style="background-color: cyan; width:20px; height:20px; display:inline-block;"></span> Nuovo cliente
              <li><span style="background-color: orange; width:20px; height:20px; display:inline-block;"></span> Non risposto
              <li><span style="background-color: yellow; width:20px; height:20px; display:inline-block;"></span> Risposto
            </ul>
            
           </fieldset>
        <?php
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
                
                <td class ='nota'>
                    <input type='text' maxlength='50' class='insNota'>
                    <button type='button' id='submitNota'>Inserisci</button>
                </td>

                <td class='app'>
                    <button class='si'>SI</button>
                    <button class='no'>NO</button>
                </td>

                <td class='data'>
                    <div id='dataAppText'></div>
                    <form class='dataApp'>
                        <input type='datetime-local' class='insApp' id='dataApp' required>
                        <button type='button' id='submitData'>Inserisci</button>
                    </form>
                </td>

                <td class='op'>
                    <div id='opText'></div>
                    <form class='nomeOp'>
                        <input type='text' class='insNomeOp' required>
                        <button type='button' id='submitNomeOp'>Inserisci</button>
                    </form>
                </td>

                <td class='pacc'>
                    <div id='nomePacText'></div>
                    <button class='si'>SI</button>
                    <button class='no'>NO</button>
                    <form class='nomePac'>
                        <input type='text' class='insPac' id='nomePac' required>
                        <button type='button' id='submitNomePac'>Inserisci</button>
                    </form>
                </td>

                <td class='idPacc'>
                    <div id='idPacText'></div>
                </td>
                
                <td class='del'>
                    <button id='delButton'></button>
                </td>
                
            </tr>";
        
            if (count($appuntamenti) == 0)
            {
                echo "<div id='noClienti'>Nessun cliente ha chiamato.<br></div>";
            }
            echo "<button class='addUser'>Aggiungi operazione</button>";
            echo "<div id='filtro'>Filtra per sede: ".$filtraSede."</div>";
            //creo una tabella per contenere i dati
            echo "<table id='clienti'>";
                
                //creo l'header della tabella
                echo "<tr>";
                    echo "<th>Data inserimento</th>";
                    echo "<th>Cliente</th>";
                    echo "<th>Trattamento</th>";
                    echo "<th>Sede</th>";
                    echo "<th>Risposto</th>";
                    echo "<th>Messaggio</th>";
                    echo "<th>Nota</th>";
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
                    echo $riga;
                }    
            }
            echo "</table>"; 
        
        
        ?>
        <script> 
            //converto le variabili php in oggetti json gestibili da JS
            var baseUrl = <?php echo json_encode(base_url()); ?>;
            var listaSedi = <?php echo json_encode($sedi); ?>;
            var results = <?php echo json_encode($appuntamenti); ?>;
            var lastPac = <?php echo json_encode($ultimoPacc); ?>;
            var nuovaRiga = <?php echo json_encode($riga); ?>;
            //infine carico JQuery e lo script di gestione del registro
        </script>
        <script src="<?php echo base_url()."assets/js/jquery-3.4.1.min.js"?>"></script>
        <script src="<?php echo base_url()."assets/js/registroChiamate.js"?>"></script>
    </body>
</html>
