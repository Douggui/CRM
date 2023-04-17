<?php
namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedSubscriber
{
   
    /**
     * 
     *
     * @param JWTCreatedEvent $event
     * @return void
     */
    public function onCreatedJWT(JWTCreatedEvent $event):void
    {
       // dd($event->getUser());
        $datas = $event->getData();
        /**
         * @var User $user 
         */
        $user = $event->getUser(); 
        $datas['firstname'] = $user->getFirstname();
        $datas['lastname'] = $user->getLastname();
        $event->setData($datas);

    }
}