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
    public function getClientiChiamanti()
    {
        $query = $this->db->query("select cliente.id_cliente, sede.id_sede, cliente.nome, cliente.cognome, cliente.numero, 
            chiamata.data_ora as data_ora_chiamata, chiamata.risp_tel, chiamata.risp_mess, chiamata.fiss_app, 
            chiamata.vend_pac, sede.indirizzo, appuntamento.data_ora as data_ora_app, id_pacc, nome_pacc
            from cliente left join chiamata on cliente.id_cliente = chiamata.cliente 
            left join sede on sede.id_sede = chiamata.sede left outer join appuntamento
            on appuntamento.cliente = cliente.id_cliente
            order by data_ora_chiamata");
        return $query;
    }
    
    public function updateTastoRisp($idCliente,$idSede,$dataora,$val)
    {
        $this->db->query("update chiamata set risp_tel = ".$val." "
                . "where cliente = ".$idCliente." "
                . "and sede = ".$idSede." "
                . "and data_ora = '".$dataora."'");
    }
    
    public function updateTastoMess($idCliente,$idSede,$dataora,$val)
    {
        $this->db->query("update chiamata set risp_mess = ".$val." "
                . "where cliente = ".$idCliente." "
                . "and sede = ".$idSede." "
                . "and data_ora = '".$dataora."'");
    }
    
    public function updateTastoApp($idCliente,$idSede,$dataora,$val)
    {
        $this->db->query("update chiamata set fiss_app = ".$val." "
                . "where cliente = ".$idCliente." "
                . "and sede = ".$idSede." "
                . "and data_ora = '".$dataora."'");
    }
    
    public function updateTastoPacc($idCliente,$idSede,$dataora,$val)
    {
        $this->db->query("update chiamata set vend_pac = ".$val." "
                . "where cliente = ".$idCliente." "
                . "and sede = ".$idSede." "
                . "and data_ora = '".$dataora."'");
    }
    
    //recupera l'ultimo id pacchetto generato
    public function getNumUltimoPacc()
    {
        $query = $this->db->query("select max(id_pacc) as ultimoPac from appuntamento");
        return $query;
    }
    
    public function setNumPacc($cliente,$sede,$dataora,$id)
    {
        $query = $this->db->query("update Appuntamento set id_pacc = ".$id." where cliente = ".$cliente." and sede = ".$sede." and data_ora = '".$dataora."'");
    }
    
    public function setNomePacchetto($cliente,$sede,$dataora,$nome)
    {
        $query = $this->db->query("update Appuntamento set nome_pacc = '".$nome."' where cliente = ".$cliente." and sede = ".$sede." and data_ora = '".$dataora."'");
    }
    
    //crea una istanza di Appuntamento
    public function createAppuntamento($idCliente,$idSede,$dataora)
    {
        $this->db->query("insert into appuntamento (cliente,sede,data_ora)"
                . " values (".$idCliente.",".$idSede.",'".$dataora."')");
    }
    */
    
    //crea una nuova riga nella tabella
    public function createAppuntamento($nome,$numero,$data_ch)
    {
        $this->db->query("insert into appuntamento (nome, numero, data_ora_ch) values('".$nome."','".$numero."','".$data_ch."')");
        //restituisco l'id della riga appena generata
        $query = $this->db->query("select max(id_app) as id from appuntamento");
        return $query->row()->id; 
    }
    
    public function updateTastoRisp($id,$val)
    {
        $this->db->query("update appuntamento set risp_tel = ".$val." "
                . "where id_app = ".$id);
    }
    
    public function updateTastoMess($id,$val)
    {
        $this->db->query("update appuntamento set risp_mess = ".$val." "
                . "where id_app = ".$id);
    }
    
    public function updateTastoApp($id,$val)
    {
        $this->db->query("update appuntamento set fiss_app = ".$val." "
                . "where id_app = ".$id);
    }
    
    public function updateTastoPacc($id,$val)
    {
        $this->db->query("update appuntamento set vend_pac = ".$val." "
                . "where id_app = ".$id);
    }

    //recupera l'ultimo id pacchetto generato
    public function getNumUltimoPacc()
    {
        $query = $this->db->query("select max(id_pacc) as ultimoPac from appuntamento");
        return $query->row()->ultimoPac;
    }
    
    public function setNumPacc($id,$idPac)
    {
        $this->db->query("update appuntamento set id_pacc = ".$idPac."where id_app = ".$id);
    }
    
    public function setNomePacchetto($id,$nome)
    {
        $this->db->query("update appuntamento set nome_pacc = '".$nome."' where id_app = ".$id);
    }
    
    public function setDataApp($id,$data_app)
    {
        $this->db->query("update appuntamento set data_ora_app = '".$data_app."' where id_app = ".$id);
    }
    
    public function setSede($id,$idSede)
    {
        $this->db->query("update appuntamento set sede = '".$idSede."' where id_app = ".$id);
    }
    
    public function setOperatrice($id,$nome)
    {
        $this->db->query("update appuntamento set operatrice = '".$nome."' where id_app = ".$id);
    }
    
    public function setTrattamento($id,$trat)
    {
        $this->db->query("update appuntamento set trattamento = '".$trat."' where id_app = ".$id);
    }
    
    
}
