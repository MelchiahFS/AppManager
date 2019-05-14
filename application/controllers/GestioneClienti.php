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
class GestioneClienti extends CI_Controller {
    
    public function index()
    {
        $this->load->model('InfoRisposte');
        $result = $this->InfoRisposte->getAppuntamenti();
        $data['appuntamenti'] = $result;
        $data['sedi'] = $this->InfoRisposte->getSedi();
        $res = $this->InfoRisposte->getNumUltimoPacc();
        $data['ultimoPacc'] = $res;
        $this->load->view('gestioneClienti', $data);
    }
    
    public function AJAX_Call()
    {
        $this->load->model('InfoRisposte');
        $comando = $this->input->post('comando');
        
        switch($comando)
        {
            case 'newApp':
                $cliente = $this->input->post('cliente');
                $numero = $this->input->post('numero');
                $data_ch = $this->input->post('data_ch');
                $result = $this->InfoRisposte->createAppuntamento($data_ch,$cliente,$numero);
                echo $result;
                break;
            case 'insSede':
                $sede = $this->input->post('sede');
                $idApp = $this->input->post('idApp');
                $this->InfoRisposte->setSede($idApp,$sede);
                break;
            case 'risp':
                $idApp = $this->input->post('idApp');
                $tasto = $this->input->post('tasto');
                $this->InfoRisposte->updateTastoRisp($idApp,$tasto);
                break;
            case 'mess':
                $idApp = $this->input->post('idApp');
                $tasto = $this->input->post('tasto');
                $this->InfoRisposte->updateTastoMess($idApp,$tasto);
                break;
            case 'app':
                $idApp = $this->input->post('idApp');
                $tasto = $this->input->post('tasto');
                $this->InfoRisposte->updateTastoApp($idApp,$tasto);
                break;
            case 'si_pacc':
                $idApp = $this->input->post('idApp');
                $tasto = $this->input->post('tasto');
                $idPac = $this->input->post('idPac');
                $this->InfoRisposte->updateTastoPacc($idApp,$tasto);
                $this->InfoRisposte->setNumPacc($idApp,$idPac);
                break;
            case 'no_pacc':
                $idApp = $this->input->post('idApp');
                $tasto = $this->input->post('tasto');
                $this->InfoRisposte->updateTastoPacc($idApp,$tasto);
                break;
            case 'insDataApp':
                $idApp = $this->input->post('idApp');
                $data = $this->input->post('data_app');
                $this->InfoRisposte->setDataApp($idApp,$data);
                break;
            case 'insOp':
                $idApp = $this->input->post('idApp');
                $op = $this->input->post('op');
                $this->InfoRisposte->setOperatrice($idApp,$op);
                break;
            case 'insTrat':
                $idApp = $this->input->post('idApp');
                $trat = $this->input->post('trat');
                $this->InfoRisposte->setTrattamento($idApp,$trat);
                break;
            case 'insNomePac':
                $idApp = $this->input->post('idApp');
                $nomePac = $this->input->post('nomePac');
                $this->InfoRisposte->setNomePacchetto($idApp,$nomePac);
                break;
            case 'getClienti':
                $res = $this->InfoRisposte->getAppuntamenti();
                echo json_encode($res);
                break;
            case 'getClientiFiltrati':
                $sede = $this->input->post('sede');
                $res = $this->InfoRisposte->getAppuntamentiPerSede($sede);
                echo json_encode($res);
                break;
            case 'resetRiga':
                $idApp = $this->input->post('idApp');
                $this->InfoRisposte->resetRiga($idApp);
                break;
            case 'delRiga':
                $idApp = $this->input->post('idApp');
                $this->InfoRisposte->deleteRiga($idApp);
                break;
            case 'insNota':
                $idApp = $this->input->post('idApp');
                $nota = $this->input->post('nota');
                $this->InfoRisposte->updateNota($idApp,$nota);
                break;
        }
    }
    
    
}
