<?php
namespace App\Events;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private InvoiceRepository $invoiceRepo,
        private Security $security,
    )
    {
        
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>['setInvoiceChrono',EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setInvoiceChrono(ViewEvent $viewEvent):void
    {
        $result = $viewEvent->getControllerResult();
        $method = $viewEvent->getRequest()->getMethod();

     
        if($result instanceof Invoice && $method === "POST"){
            $lastChrono = $this->invoiceRepo->findLastChrono($this->security->getUser());
            
            $result->setChrono($lastChrono+1);
        }
    }
}