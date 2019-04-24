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
    </head>
    <body>
        <?php echo validation_errors(); ?>

        <?php echo form_open('logincontroller');?>

        <h5>Username</h5>
        <input type="text" name="username" value="" size="50" />

        <h5>Password</h5>
        <input type="password" name="password" value="" size="50" />
        <div><input type="submit" value="Submit" /></div>
        
        <b>
        <?php foreach($resArray->result() as $row)
        {
            echo $row->nome;
            echo $row->cognome;
        }
        ?>
        </b>

        </form>
    </body>
</html>
