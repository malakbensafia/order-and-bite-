import logo from './logo.png'
import cart from './cart.png'

import all from './all.jpg'
import hamburger from './hamburger.jpg'
import pizza from './pizza.jpg'
import grill from './grill.jpg'
import salade from './salade.jpg'
import vegetarian from './vegetarian.jpg'
import traditionalfood from './traditionalfood.jpg'
import dessert from './dessert.jpg'
import drink from './drink.jpg'
import sauce from './sauce.jpg'
import pasta from './pasta.jpg'
import spaghetticarbonara from './spaghetticarbonara.jpg'
import discount10 from './discount10.png'
import discount15 from './discount15.png'
import discount20 from './discount20.png'
import discount50 from './discount50.png'
import discount75 from './discount75.png'
import facebook from './facebook.png'
import twitter from './twitter.png'
import linkedin from './linkedin.png'
import lg from './lg.png'
import BBQburger from './BBQburger.jpg'
import elkburger from './elkburger.jpg'
import cheeseburger from './cheeseburger.jpg'
import doublecheeseburger from './doublecheeseburger.jpg'
import pattymelt from './pattymelt.jpg'
import salmonburger from './salmonburger.jpg'
import turkeyburger from './turkeyburger.jpg'

import pizzamargharita from './pizzamargharita.jpg'
import pizzamarinara from './pizzamarinara.jpg'
import pizzaquatrefromage from './pizzaquatrefromage.jpg'
import diavolapizza from './diavolapizza.jpg'
import pizzapeperonni from './pizzapeperonni.jpg'
import pizzaviandehachee from './pizzaviandehachee.jpg'

import alfredopasta from './alfredopasta.jpg'
import bolognese from './bolognese.jpg'
import meatballs from './meatballs.jpg'
import raviole from './raviole.jpg'

import barbecusticks from './barbecusticks.jpg'
import cotes from './cotes.jpg'
import salmon from './salmon.jpg'
import meatrice from './meatrice.jpg'
import poulet from './poulet.jpg'
import steak from './steak.jpg'

import saladebrocoli from './saladebrocoli.jpg'
import saladecomcombre from './saladecomcombre.jpg'
import saladeepinard from './saladeepinard.jpg'
import saladepasta from './saladepasta.jpg'
import saladepois from './saladepois.jpg'
import saladenormale from './saladenormale.jpg'

import vegpizza from './vegpizza.jpg'
import vegburger from './vegburger.jpg'
import vegetarianmeatballs from './vegetarianmeatballs.jpg'
import vegetarianlasagna from './vegetarianlasagna.jpg'
import pumpkinsoup from './pumpkinsoup.jpg'

import couscouss from './couscouss.jpg'
import shakshouka from './shakshouka.jpg'
import baghrir from './baghrir.jpg'
import mahjouba from './mahjouba.jpg'

import lemontart from './lemontart.jpg'
import chocolatecake from './chocolatecake.jpg'
import cheesecake from './cheesecake.jpg'
import tiramisu from './tiramisu.jpg'
import chocogelato from './chocogelato.jpg'
import plus from './plus.png'
import icedtea from './icedtea.jpg'
import coffe from './coffe.jpg'
import lemon from './lemon.jpg'
import chocolatemilkshake from './chocolatemilkshake.jpg'
import milk from './milk.jpg'
import orangejuice from './orangejuice.jpg'
import remove from './remove.png'
import addgreen from './addgreen.png'
import close from './close.png'
import avatar from './avatar.jpg'
import user from './user.png'
import bell from './bell.png'
import fenetre from './fenetre.jpg'
import vip from './vip.jpg'
import terasse from './terasse.jpg'
import interieur from './interieur.jpg'
export const assets = {
  logo,
  cart,
  discount10,
  discount15,
  discount20,
  discount50,
  discount75,
  facebook,
  twitter,
  linkedin,
  lg,
  plus,
  remove,
  addgreen,
  close,
  avatar,
  user,
  bell,



}
export const zones = [
  {
    key: "terrasse",
    label: "Terrasse",
    image: terasse,
  },
  {
    key: "interieur",
    label: "Intérieur",
    image: interieur,
  },
  {
    key: "vip",
    label: "VIP",
    image: vip,
  },
  {
    key: "fenetre",
    label: "Près de fenêtre",
    image: fenetre,
  },
];
export const menu_list = [
  {
    menu_name: "Tout",
    menu_image: all
  },
  {
    menu_name: "Burger",
    menu_image: hamburger
  },
  {
    menu_name: "Pizza",
    menu_image: pizza
  },
  {
    menu_name: "Pasta",
    menu_image: pasta
  },
  {
    menu_name: "Grillades",
    menu_image: grill
  },
  {
    menu_name: "Salade",
    menu_image: salade
  },
  {
    menu_name: "Végétarien",
    menu_image: vegetarian
  },
  {
    menu_name: "Traditionnel",
    menu_image: traditionalfood
  },
  {
    menu_name: "Dessert",
    menu_image: dessert
  },
  {
    menu_name: "Boissons",
    menu_image: drink
  },


]

export const plats = [
  {
    _id: 1,
    name: "Pizza Marinara",
    image: pizzamarinara,
    desc: "Tomate, mozzarella, basilic frais",
    price: 1000,
    rating: 4.7,
    category: "Pizza",
    discount: "-20%",
    popular: true

  },
  {
    _id: 2,
    name: "Elk Burger",
    image: elkburger,
    desc: "Steak, fromage, sauce maison",
    price: 900,
    rating: 4.5,
    category: "Burger",
    discount: "-25%",
    popular: true


  },
  {
    _id: 3,
    name: "Pasta Carbonara",
    image: spaghetticarbonara,
    desc: "Crème, bacon, parmesan",
    price: 800,
    rating: 4.6,
    category: "Pasta",
    discount: "-20%",
    popular: true

  }

]



// 🔥 MAP IMAGES SUPABASE → REACT
export const imagesMap = {
  "BBQburger.jpg": BBQburger,
  "cheeseburger.jpg": cheeseburger,
  "doublecheeseburger.jpg": doublecheeseburger,
  "pattymelt.jpg": pattymelt,
  "elkburger.jpg":elkburger,
  "salmonburger.jpg": salmonburger,
  "turkeyburger.jpg": turkeyburger,
   
  "pizzamarinara.jpg":pizzamarinara,
  "pizzamargharita.jpg": pizzamargharita,
  "pizzaquatrefromage.jpg": pizzaquatrefromage,
  "diavolapizza.jpg": diavolapizza,
  "pizzapeperonni.jpg": pizzapeperonni,
  "pizzaviandehachee.jpg": pizzaviandehachee,

  "alfredopasta.jpg": alfredopasta,
  "bolognese.jpg": bolognese,
  "meatballs.jpg": meatballs,
  "raviole.jpg": raviole,

  "barbecusticks.jpg": barbecusticks,
  "cotes.jpg": cotes,
  "salmon.jpg": salmon,
  "meatrice.jpg": meatrice,
  "poulet.jpg": poulet,
  "steak.jpg": steak,

  "saladebrocoli.jpg": saladebrocoli,
  "saladecomcombre.jpg": saladecomcombre,
  "saladeepinard.jpg": saladeepinard,
  "saladepasta.jpg": saladepasta,
  "saladepois.jpg": saladepois,
  "saladenormale.jpg": saladenormale,

  "vegpizza.jpg": vegpizza,
  "vegburger.jpg": vegburger,
  "vegetarianmeatballs.jpg": vegetarianmeatballs,
  "vegetarianlasagna.jpg": vegetarianlasagna,
  "pumpkinsoup.jpg": pumpkinsoup,

  "couscouss.jpg": couscouss,
  "shakshouka.jpg": shakshouka,
  "baghrir.jpg": baghrir,
  "mahjouba.jpg": mahjouba,

  "lemontart.jpg": lemontart,
  "chocolatecake.jpg": chocolatecake,
  "cheesecake.jpg": cheesecake,
  "tiramisu.jpg": tiramisu,
  "chocogelato.jpg": chocogelato,

  "icedtea.jpg": icedtea,
  "coffe.jpg": coffe,
  "lemon.jpg": lemon,
  "chocolatemilkshake.jpg": chocolatemilkshake,
  "milk.jpg": milk,
  "orangejuice.jpg": orangejuice,
}








