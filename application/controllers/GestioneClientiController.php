<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of GestioneClientiController
 *
 * @author Enrico
 */
class GestioneClientiController extends CI_Controller {
    
    public function index()
    {
        $this->load->model('InfoRisposte');
        $result = $this->InfoRisposte->getClientiChiamanti();
        $data['clienti'] = $result;
        $res = $this->InfoRisposte->getNumUltimoPacc();
        $data['ultimoPacc'] = $res;
        $this->load->view('gestioneClienti', $data);
    }
    
    public function AJAX_Chiamata()
    {
        $this->load->model('InfoRisposte');
        
        $cliente = $this->input->post('cliente');
        $sede = $this->input->post('sede');
        $comando = $this->input->post('comando');
        $dataora = $this->input->post('data_ora_ch');
        
        if ($comando == 'pacc')
        {
            foreach($this->input->post('valore') as $key => $value)
            {
                if ($key == 'pac')
                    $pac = $value;
                if ($key == 'id')
                    $idPac = $value;
                if ($key == 'dataora_app')
                    $dataora_app = $value;
            }
        }
        else
            $valore = $this->input->post('valore');
        
        switch($comando)
        {
            case 'risp':
                $this->InfoRisposte->updateTastoRisp($cliente,$sede,$dataora,$valore);
                break;
            case 'mess':
                $this->InfoRisposte->updateTastoMess($cliente,$sede,$dataora,$valore);
                break;
            case 'app':
                $this->InfoRisposte->updateTastoApp($cliente,$sede,$dataora,$valore);
                break;
            case 'pacc':
                $this->InfoRisposte->updateTastoPacc($cliente,$sede,$dataora,$pac);
                $this->InfoRisposte->setNumPacc($cliente,$sede,$dataora_app,$idPac);
                break;
        }
    }
    
    public function AJAX_Appuntamento()
    {
        $this->load->model('InfoRisposte');
        
        $cliente = $this->input->post('cliente');
        $sede = $this->input->post('sede');
        $comando = $this->input->post('comando');
        
        
        if ($comando == 'nomePacc')
        {
            foreach($this->input->post('valore') as $key => $value)
            {
                if ($key == 'dataora')
                    $dataora = $value;
                if ($key == 'nome')
                    $nome = $value;
            }
        }
        else
            $valore = $this->input->post('valore');
        
        switch ($comando)
        {
            case 'insApp':
                $this->InfoRisposte->createAppuntamento($cliente,$sede,$valore);
                break;
            case 'nomePacc':
                $this->InfoRisposte->setNomePacchetto($cliente,$sede,$dataora,$nome);
                break;
        }
    }
}
