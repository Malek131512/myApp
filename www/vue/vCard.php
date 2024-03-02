<?php

use vCard\vCard;

if(isset($_REQUEST['nom'])&& isset($_REQUEST['prenom'])&& isset($_REQUEST['email'])&& isset($_REQUEST['tel'])){

header("Content-type: text/vcard");
header("Content-Disposition: attachment; filename=\"".$_REQUEST['prenom']."_".$_REQUEST['nom'].".vcf\";");
    require_once(__DIR__.'/inc/vCard.php');

    $vcard = new vCard();

    $vcard->setName($_REQUEST['prenom'],$_REQUEST['nom']);

// Every set functions below are optional
    $vcard->setTitle("");
    $vcard->setPhone($_REQUEST['tel']);
    $vcard->setURL("");
   // $vcard->setTwitter("diplodocus");
    $vcard->setMail($_REQUEST['email']);
   // $vcard->setAddress(array(
   //     "street_address"   => "Main Street",
    //    "city"             => "Ghost Town",
      //  "state"            => "",
     //   "postal_code"      => "012345",
     //   "country_name"     => "Somewhere"
   // ));
   // $vcard->setNote("Lorem Ipsum, \nWith new line.");
  //  $vcard->setPhoto("john.jpg");

    echo $vcard;
}
