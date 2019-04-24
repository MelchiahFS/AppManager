<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of LoginController
 *
 * @author Enrico
 */
class LoginController extends CI_Controller
{
    public function index()
    {
        $this->load->helper('form');
        $this->load->model('UserCredentials');
        $this->load->library('form_validation');
        
        $this->form_validation->set_rules('username', 'Username', 'required');
        $this->form_validation->set_rules('password', 'Password', 'required');
        
        if ($this->form_validation->run() == TRUE)
        {
//            $data['userdata'] = $this->UserCredentials->getUserByCredentials($this->input->post('username'),$this->input->post('password'));
            $user = $this->input->post("username");
            $password = $this->input->post("password");
            $result = $this->UserCredentials->getUserByCredentials($user, $password);
            $data['nome'] = $result->nome;
            $data['cognome'] = $result->cognome;
            $this->load->view('welcome_message',$data);
            
        }
        else
        {
            $this->load->view('loginPage');
        }
 
    }
}
