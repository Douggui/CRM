<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Invoice;
use App\Entity\Customer;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\PasswordHasher\PasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct
    (
        private UserPasswordHasherInterface $passwordHasher,
    )
    {
        
    }
    public function load(ObjectManager $manager ): void
    {
        
        $faker=Factory::create('fr_FR');
        for ($u=0; $u <10 ; $u++) {
            $user = new User();
            $chrono = 1; 
            $user->setFirstname($faker->firstName())
                 ->setLastname($faker->lastName())
                 ->setEmail($faker->email())
                 ->setPassword($this->passwordHasher->hashPassword($user,'password'))
                 ;
            $manager->persist($user);
            $randCustomer = rand(5,20);

            for($i=0 ; $i<=$randCustomer ; $i++){
                $customer = new Customer();
                $customer->setFirstname($faker->firstname())
                        ->setLastname($faker->lastname())
                        ->setEmail($faker->email())
                        ->setCompany($faker->company())
                        ->setUser($user)
                        ;
                $manager->persist($customer);
                $rand=rand(3,10);       
                for($j=0 ; $j<=$rand ; $j++){
                    $invoice=new Invoice();
                    $invoice->setAmount($faker->randomFloat(2,500,5000))
                            ->setCustomer($customer)
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement([Invoice::SENT,Invoice::CANCELED,Invoice::PAYED]))
                            ->setChrono($chrono);
                    $manager->persist($invoice);
                    $chrono++;
                }
            }
    
        }
       
        $manager->flush();
    }
}