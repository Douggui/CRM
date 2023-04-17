<?php
namespace App\Events;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Invoice;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class InvoiceSentAtSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>['setSentAt',EventPriorities::PRE_VALIDATE]
        ];
    }
    public function setSentAt(ViewEvent $viewEvent)
    {
        $result = $viewEvent->getControllerResult();
        $method = $viewEvent->getRequest()->getMethod();

        if($result instanceof Invoice && $method === 'POST')
        {
            if(empty($result->getSentAt()))
            {
                $result->setSentAt(new DateTime());
            }
        }
    }
}