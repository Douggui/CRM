<?php

namespace App\Entity;


use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use Doctrine\Common\Collections\ArrayCollection;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
#[ApiResource(
    
    normalizationContext: ['groups' => ['customers:read']],
)]

#[ApiFilter(SearchFilter::class, properties: ['firstname'=>'partial','lastname'=>'partial'])]
#[ApiFilter(OrderFilter::class , properties: ['firstname','invoices.amount'], arguments: ['orderParameterName' => 'order'])]
class Customer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['customers:read','invoices:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\Length(min:3,
    minMessage:"le prénom doit faire au minimum 3 caractères",
    max:20,
    maxMessage:"le prénom doit faire au maximum 20 caractères"
    )]
    #[Assert\NotBlank(message:"le prénom ne peut pas être vide")]
    #[Groups(['customers:read','invoices:read'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers:read','invoices:read'])]
    #[Assert\Length(min:3,
    minMessage:"le nom doit faire au minimum 3 caractères",
    max:20,
    maxMessage:"le nom doit faire au maximum 20 caractères"
    )]
    #[Assert\NotBlank(message:"le nom ne peut pas être vide")]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers:read','invoices:read'])]
    #[Assert\NotBlank(message:"l'email ne peut pas être vide")]
    #[Assert\Email(message:"l'email {{ value }} n'est pas valide")]
    private ?string $email = null;

    #[Groups(['customers:read','invoices:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $company = null;

    #[Groups(['customers:read'])]
    // #[ApiSubRessource()]
    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Invoice::class)]
    private Collection $invoices;

    #[ORM\ManyToOne(inversedBy: 'customers')]
    #[Groups(['customers:read'])]
    #[Assert\NotBlank(message:"l'utilisateur ne peut pas être vide")]
    private ?User $user = null;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices->add($invoice);
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }
    
    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
    /**
     * return a total amount of customer's invoices
     * @return float
     */
    #[Groups(['customers:read'])]
    public function getTotalAmount():float{
        $totalAmount = 0;
        foreach ($this->invoices as $invoice) {
            $totalAmount += $invoice->getAmount();
        }
        return $totalAmount;
       
    }
    /**
     * return a total of not paid customer's invoices
     *
     * @return float
     */
    #[Groups(['customers:read'])]
    public function getNotPaidAmount():float{

        $totalNotPaid = 0 ;
        return array_reduce($this->invoices->toArray(),function($totalNotPaid,$invoices){
            
          return   $invoices->getStatus() === Invoice::SENT ? $totalNotPaid + $invoices->getAmount() : $totalNotPaid ;
        },$totalNotPaid);
    }
    
}