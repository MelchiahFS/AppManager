<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of InfoRisposte
 *
 * @author Enrico
 */
class InfoRisposte extends CI_Model {

    /*    

    //recupera l'ultimo id pacchetto generato
    public function getNumUltimoPacc()
    {
        $query = $this->db->query("select max(id_pacc) as ultimoPac from appuntamento");
        return $query;
    }
    
    
    public function setNomePacchetto($cliente,$sede,$dataora,$nome)
    {
        $query = $this->db->query("update Appuntamento set nome_pacc = '".$nome."' where cliente = ".$cliente." and sede = ".$sede." and data_ora = '".$dataora."'");
    }
    
    */
    
    //recupera i dati degli appuntamenti esistenti per la rappresentazione dei dati
    public function getAppuntamenti()
    {
        $query = $this->db->query("select id_app, data_ora_ch, nome, numero, sede, risp_tel, 
            risp_mess, fiss_app, data_ora_app, operatrice, trattamento, vend_pac, 
            nome_pacc, id_pacc 
            from Appuntamento order by data_ora_ch");
        return $query->result();
    }
    
    public function getAppuntamentiPerSede($sede)
    {
        $query = $this->db->query("select id_app, data_ora_ch, nome, numero, sede, risp_tel, 
            risp_mess, fiss_app, data_ora_app, operatrice, trattamento, vend_pac, 
            nome_pacc, id_pacc 
            from Appuntamento where sede = ".$this->db->escape($sede)." or sede is null order by data_ora_ch");
        return $query->result();
    }
    
    
    //crea una nuova riga nella tabella
    public function createAppuntamento($data_ch,$nome,$numero)
    {
        $this->db->query("insert into Appuntamento (nome, numero, data_ora_ch) values(".$this->db->escape($nome).",".$this->db->escape($numero).",".$this->db->escape($data_ch).")");
        //restituisco l'id della riga appena generata
        $query = $this->db->query("select max(id_app) as id from Appuntamento");
        return $query->row()->id;
    }
    
    
    //le seguenti quattro funzioni aggiornano i tasti SI/NO
    public function updateTastoRisp($id,$val)
    {
        $this->db->query("update Appuntamento set risp_tel = ".$this->db->escape($val)." "
                . "where id_app = ".$this->db->escape($id));
    }
    
    public function updateTastoMess($id,$val)
    {
        $this->db->query("update Appuntamento set risp_mess = ".$this->db->escape($val)." "
                . "where id_app = ".$this->db->escape($id));
    }
    
    public function updateTastoApp($id,$val)
    {
        $this->db->query("update Appuntamento set fiss_app = ".$this->db->escape($val)." "
                . "where id_app = ".$this->db->escape($id));
    }
    
    public function updateTastoPacc($id,$val)
    {
        $this->db->query("update Appuntamento set vend_pac = ".$this->db->escape($val)." "
                . "where id_app = ".$this->db->escape($id));
    }

    //recupera l'ultimo id pacchetto generato
    public function getNumUltimoPacc()
    {
        $query = $this->db->query("select max(id_pacc) as ultimoPac from Appuntamento");
        return $query->row()->ultimoPac;
    }
    
    //imposta il numero progressivo del pacchetto venduto
    public function setNumPacc($id,$idPac)
    {
        $this->db->query("update Appuntamento set id_pacc = ".$this->db->escape($idPac)." where id_app = ".$this->db->escape($id));
    }
    
    //imposta il nome del pacchetto venduto
    public function setNomePacchetto($id,$nome)
    {
        $this->db->query("update Appuntamento set nome_pacc = ".$this->db->escape($nome)." where id_app = ".$this->db->escape($id));
    }
    
    //imposta la data dell'appuntamento
    public function setDataApp($id,$data_app)
    {
        $this->db->query("update Appuntamento set data_ora_app = ".$this->db->escape($data_app)." where id_app = ".$this->db->escape($id));
    }
    
    //preleva id e indirizzo delle sedi per filtro e inserimento
    public function getSedi()
    {
        $query = $this->db->query("select * from Sede");
        return $query->result();
    }
    
    //imposta la sede dell'appuntamento
    public function setSede($id,$sede)
    {
        $this->db->query("update Appuntamento set sede = ".$this->db->escape($sede)." where id_app = ".$this->db->escape($id));
    }
    
    //imposta l'operatrice che eseguirà il trattamento
    public function setOperatrice($id,$nome)
    {
        $this->db->query("update Appuntamento set operatrice = ".$this->db->escape($nome)." where id_app = ".$this->db->escape($id));
    }
    
    //imposta il trattamento offerto
    public function setTrattamento($id,$trat)
    {
        $this->db->query("update Appuntamento set trattamento = ".$this->db->escape($trat)." where id_app = ".$this->db->escape($id));
    }
    
    
}
