<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of InfoRisposte
 *
 * @author Enrico Melis
 */
class InfoRisposte extends CI_Model {
    
    //recupera i dati degli appuntamenti esistenti per la rappresentazione dei dati
    public function getAppuntamenti()
    {
        $query = $this->db->query("select id_app, data_ora_ch, nome, numero, sede, risp_tel, 
            risp_mess, nota, fiss_app, data_ora_app, operatrice, trattamento, vend_pac, 
            nome_pacc, id_pacc 
            from Appuntamento order by data_ora_ch");
        return $query->result();
    }
    
    //recupera gli appuntamenti dei clienti in una determinata sede
    public function getAppuntamentiPerSede($sede)
    {
        $query = $this->db->query("select id_app, data_ora_ch, nome, numero, sede, risp_tel, 
            risp_mess, fiss_app, data_ora_app, operatrice, trattamento, vend_pac, 
            nome_pacc, id_pacc 
            from Appuntamento where sede = ".$this->db->escape($sede)." or sede is null order by data_ora_ch");
        return $query->result();
    }
    
    
    //Crea una nuova riga nella tabella
    public function createAppuntamento($data_ch,$nome,$numero)
    {
        $this->db->query("insert into Appuntamento (nome, numero, data_ora_ch) values(".$this->db->escape($nome).",".$this->db->escape($numero).",".$this->db->escape($data_ch).")");
        //restituisco l'id della riga appena generata
        $query = $this->db->query("select max(id_app) as id from Appuntamento");
        return $query->row()->id;
    }
    
    
    //Le seguenti quattro funzioni aggiornano i tasti SI/NO
    public function updateTastoRisp($id,$val)
    {
        if ($val == 'true')
            $val = 1;
        else
            $val = 0;
        $this->db->query("update Appuntamento set risp_tel = ".$this->db->escape($val)." "
                . "where id_app = ".$this->db->escape($id));
    }
    
    public function updateTastoMess($id,$val)
    {
        if ($val == 'true')
            $val = 1;
        else
            $val = 0;
        $this->db->query("update Appuntamento set risp_mess = ".$this->db->escape($val)." "
                . "where id_app = ".$this->db->escape($id));
    }
    
    public function updateTastoApp($id,$val)
    {
        if ($val == 'true')
            $val = 1;
        else
            $val = 0;
        $this->db->query("update Appuntamento set fiss_app = ".$this->db->escape($val)." "
                . "where id_app = ".$this->db->escape($id));
    }
    
    public function updateTastoPacc($id,$val)
    {
        if ($val == 'true')
            $val = 1;
        else
            $val = 0;
        $this->db->query("update Appuntamento set vend_pac = ".$this->db->escape($val)." "
                . "where id_app = ".$this->db->escape($id));
    }

    //Recupera l'ultimo id pacchetto generato
    public function getNumUltimoPacc()
    {
        $query = $this->db->query("select max(id_pacc) as ultimoPac from Appuntamento");
        return $query->row()->ultimoPac;
    }
    
    //Imposta il numero progressivo del pacchetto venduto
    public function setNumPacc($id,$idPac)
    {
        $this->db->query("update Appuntamento set id_pacc = ".$this->db->escape($idPac)." where id_app = ".$this->db->escape($id));
    }
    
    //Imposta il nome del pacchetto venduto 
    //OPPURE il motivo per cui il pacchetto non è stato venduto
    public function setNomePacchetto($id,$nome)
    {
        $this->db->query("update Appuntamento set nome_pacc = ".$this->db->escape($nome)." where id_app = ".$this->db->escape($id));
    }
    
    //Imposta la data dell'appuntamento
    public function setDataApp($id,$data_app)
    {
        $this->db->query("update Appuntamento set data_ora_app = ".$this->db->escape($data_app)." where id_app = ".$this->db->escape($id));
    }
    
    //Preleva l'elenco delle sedi per filtro e inserimento
    public function getSedi()
    {
        $query = $this->db->query("select * from Sede");
        return $query->result();
    }
    
    //Imposta la sede dell'appuntamento
    public function setSede($id,$sede)
    {
        $this->db->query("update Appuntamento set sede = ".$this->db->escape($sede)." where id_app = ".$this->db->escape($id));
    }
    
    //Imposta l'operatrice che eseguirà il trattamento
    public function setOperatrice($id,$nome)
    {
        $this->db->query("update Appuntamento set operatrice = ".$this->db->escape($nome)." where id_app = ".$this->db->escape($id));
    }
    
    //Imposta il trattamento offerto
    public function setTrattamento($id,$trat)
    {
        $this->db->query("update Appuntamento set trattamento = ".$this->db->escape($trat)." where id_app = ".$this->db->escape($id));
    }
    
    //Elimina le informazioni del cliente relative all'appuntamento
    public function resetRiga($id)
    {
        $this->db->query("update Appuntamento set risp_tel = null, risp_mess = null, nota = null, "
                . "fiss_app = null, data_ora_app = null, operatrice = null, vend_pac = null, id_pacc = null, nome_pacc = null "
                . "where id_app = ".$this->db->escape($id));
    }
    
    //Elimina l'intera riga
    public function deleteRiga($id)
    {
        $this->db->query("delete from Appuntamento where id_app = ".$this->db->escape($id));
    }
    
    //Aggiorna la nota
    public function updateNota($id,$nota)
    {
        $this->db->query("update Appuntamento set nota = ".$this->db->escape($nota)." where id_app = ".$this->db->escape($id));
    }
    
    //Aggiunge una nuova sede
    public function addSede($sede)
    {
        $this->db->query("insert into Sede (indirizzo) values (".$this->db->escape($sede).")");
    }
    
}
