<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UserCredentials
 *
 * @author Enrico
 */
class UserCredentials extends CI_Model{
    
    public function getUserByCredentials($user, $password)
    {
//        $this->load->database();
//        $sql = 'select nome, cognome from utente where username = ? and password = ?';
////        $query = $this->db->query($sql, array($this->db->escape($username), $this->db->escape($password)));
        $query = $this->db->query("select nome, cognome from utente where username = ".$this->db->escape($user)." and pass = ".$this->db->escape($password));
        return $query->row();
//        if ($query->num_rows() == 1)
//        {
//            return $query->result();
//        }
    }
}
