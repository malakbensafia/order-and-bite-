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

export const food_list = [
  {
    _id: 1,
    name: "BBQ Burger",
    image: BBQburger,
    price: 700,
    description: "Steak grillé nappé de sauce barbecue, fromage fondant et salade fraîche, servi dans un pain moelleux, accompagné de frites croustillantes.",
    category: "Burger"
  },
  {
    _id: 2,
    name: "Cheese Burger",
    image: cheeseburger,
    price: 600,
    description: "Steak juteux avec fromage fondu, laitue et sauce maison dans un pain tendre, accompagné de frites dorées.",
    category: "Burger"
  },
  {
    _id: 3,
    name: "DoubleCheese Burger",
    image: doublecheeseburger,
    price: 800,
    description: "Deux steaks savoureux avec double fromage fondant, pour un burger généreux, accompagné de frites croustillantes.",
    category: "Burger"
  },
  {
    _id: 4,
    name: "Patty melt",
    image: pattymelt,
    price: 750,
    description: "Steak grillé avec fromage fondu et oignons caramélisés dans du pain toasté, accompagné de frites.",
    category: "Burger"
  },
  {
    _id: 5,
    name: "Elk Burger",
    image: elkburger,
    price: 1000,
    description: "Burger à la viande de cerf riche en goût, avec légumes frais et sauce spéciale, accompagné de frites.",
    category: "Burger"
  },
  {
    _id: 6,
    name: "Salmon Burger",
    image: salmonburger,
    price: 1000,
    description: "Filet de saumon grillé avec salade croquante et sauce légère, servi avec des frites croustillantes.",
    category: "Burger"
  },
  {
    _id: 7,
    name: "Turkey Burger",
    image: turkeyburger,
    price: 700,
    description: "Burger léger au steak de dinde grillé, accompagné de fromage, salade fraîche et sauce douce, servi dans un pain moelleux avec des frites croustillante",
    category: "Burger"
  },
  {
    _id: 8,
    name: "Pizza Marinara",
    image: pizzamarinara,
    price: 750,
    description: "Sauce tomate parfumée à l’ail et aux herbes, sans fromage, pour une pizza simple et authentique.",
    category: "Pizza"
  },
  {
    _id: 9,
    name: "Pizza Margharita",
    image: pizzamargharita,
    price: 800,
    description: "Sauce tomate, mozzarella fondante et basilic, une pizza classique et savoureuse.",
    category: "Pizza"
  },
  {
    _id: 10,
    name: "Pizza Quatre Fromages",
    image: pizzaquatrefromage,
    price: 1000,
    description: "Mélange gourmand de fromages fondants (mozzarella, bleu, chèvre, parmesan) sur une base tomate ou crème.",
    category: "Pizza"
  },
  {
    _id: 11,
    name: "Pizza Diavola",
    image: diavolapizza,
    price: 950,
    description: "Pizza relevée avec sauce tomate, mozzarella et salami épicé pour les amateurs de sensations fortes.",
    category: "Pizza"
  },
  {
    _id: 12,
    name: "Pizza Pepperoni",
    image: pizzapeperonni,
    price: 900,
    description: "Sauce tomate, mozzarella et tranches de pepperoni légèrement épicées.",
    category: "Pizza"
  },
  {
    _id: 13,
    name: "Pizza Viande Hachée",
    image: pizzaviandehachee,
    price: 950,
    description: "Sauce tomate, viande hachée savoureuse, fromage fondant et herbes aromatiques.",
    category: "Pizza"
  },
  {
    _id: 14,
    name: "Alfredo Pasta",
    image: alfredopasta,
    price: 850,
    description: "Pâtes crémeuses à la sauce Alfredo onctueuse, parmesan fondant et touche de beurre.",
    category: "Pasta"
  },
  {
    _id: 15,
    name: "Spaghetti Bolognese",
    image: bolognese,
    price: 800,
    description: "Spaghettis avec sauce tomate mijotée à la viande hachée, riche et savoureuse.",
    category: "Pasta"
  },
  {
    _id: 16,
    name: "Spaghetti MeatBalls",
    image: meatballs,
    price: 950,
    description: "Spaghettis accompagnés de boulettes de viande tendres dans une sauce tomate parfumée.",
    category: "Pasta"
  },
  {
    _id: 17,
    name: "Ravioli",
    image: raviole,
    price: 900,
    description: "Raviolis farcis viande servis avec sauce tomate .",
    category: "Pasta"
  },

  {
    _id: 19,
    name: "Spaghetti Carbonara",
    image: spaghetticarbonara,
    price: 900,
    description: "Spaghettis à la crème, œufs, fromage et morceaux de bacon pour une recette classique italienne.",
    category: "Pasta"
  },
  {
    _id: 20,
    name: "Brochettes BBQ",
    image: barbecusticks,
    price: 900,
    description: "Brochettes de viande marinée et grillée au barbecue, servies avec sauce maison et frites ou légumes.",
    category: "Grillades"
  },
  {
    _id: 21,
    name: "Côtes d’agneau",
    image: cotes,
    price: 1300,
    description: "Côtes d’agneau grillées au feu de bois, tendres et parfumées.",
    category: "Grillades"
  },
  {
    _id: 22,
    name: "Saumon frit avec légumes",
    image: salmon,
    price: 1100,
    description: "Un filet de saumon doré à la poêle, accompagné de légumes frais sautés .",
    category: "Grillades"
  },
  {
    _id: 23,
    name: "Viande Barbecue avec Riz",
    image: meatrice,
    price: 1000,
    description: "Viande grillée croustillante servie avec riz parfumé et sauce barbecue.",
    category: "Grillades"
  },
  {
    _id: 24,
    name: "Poulet grillé",
    image: poulet,
    price: 850,
    description: "Poulet grillé au barbecue servi avec pommes de terre et petits pois.",
    category: "Grillades"
  },
  {
    _id: 25,
    name: "Steak grillé aux légumes",
    image: steak,
    price: 1200,
    description: "Steak de bœuf grillé accompagné de légumes sautés et asperges.",
    category: "Grillades"
  },

  {
    _id: 26,
    name: "Salade brocoli raisins",
    image: saladebrocoli,
    price: 650,
    description: "Brocoli croquant et raisins sucrés avec sauce légère.",
    category: "Salade"
  },
  {
    _id: 27,
    name: "Salade comcombre crème",
    image: saladecomcombre,
    price: 500,
    description: "Concombres frais avec sauce crème onctueuse.",
    category: "Salade"
  },
  {
    _id: 28,
    name: "Salade épinards lardons",
    image: saladeepinard,
    price: 750,
    description: "Épinards frais avec lardons grillés et sauce chaude.",
    category: "Salade"
  },
  {
    _id: 29,
    name: "Salade pasta",
    image: saladepasta,
    price: 700,
    description: "Pâtes froides avec légumes et sauce légère.",
    category: "Salade"
  },
  {
    _id: 30,
    name: "Salade pois chiches avocat",
    image: saladepois,
    price: 800,
    description: "Pois chiches et avocat frais assaisonnés au citron.",
    category: "Salade"
  },
  {
    _id: 31,
    name: "Salade classique",
    image: saladenormale,
    price: 450,
    description: "Laitue, tomates, concombres et vinaigrette maison.",
    category: "Salade"
  },

  {
    _id: 32,
    name: "Pizza végétarienne",
    image: vegpizza,
    price: 850,
    description: " Pizza garnie de légumes frais (poivrons, champignons, olives, tomates) avec mozzarella fondante sur une base sauce tomate.",
    category: "Végétarien"
  },
  {
    _id: 33,
    name: " Burger végétarien",
    image: vegburger,
    price: 750,
    description: "Burger végétarien à base de galette de légumes, salade fraîche, tomate et sauce légère dans un pain moelleux.",
    category: "Végétarien"
  },
  {
    _id: 34,
    name: "Boulettes végétariennes",
    image: vegetarianmeatballs,
    price: 800,
    description: "Boulettes végétariennes à base de légumes et légumineuses, servies avec sauce tomate parfumée.",
    category: "Végétarien"
  },
  {
    _id: 35,
    name: "Lasagna végétarienne",
    image: vegetarianlasagna,
    price: 900,
    description: "Lasagnes aux légumes grillés, sauce tomate et fromage fondant, recette riche et savoureuse sans viande.",
    category: "Végétarien"
  },
  {
    _id: 36,
    name: "Soupe Citrouille",
    image: pumpkinsoup,
    price: 500,
    description: "Soupe onctueuse à la citrouille, légèrement épicée et crémeuse, parfaite en entrée légère.",
    category: "Végétarien"
  },

  {
    _id: 37,
    name: "Couscous",
    image: couscouss,
    price: 1200,
    description: "Plat traditionnel à base de semoule vapeur, légumes variés et viande tendre agneau , servi avec sauce parfumée.",
    category: "Traditionnel"
  },
  {
    _id: 38,
    name: "Chakchouka",
    image: shakshouka,
    price: 600,
    description: "Poivrons, tomates et œufs mijotés dans une sauce savoureuse légèrement épicée.",
    category: "Traditionnel"
  },
  {
    _id: 39,
    name: "Baghrir",
    image: baghrir,
    price: 100,
    description: "Crêpes milles trous traditionnelles servies avec miel,beurre fondu et huile d'olive avec sucre .",
    category: "Traditionnel"
  },
  {
    _id: 40,
    name: "Mhajeb",
    image: mahjouba,
    price: 100,
    description: "Galette fine farcie à la sauce tomate, oignons et poivrons, légèrement épicée et croustillante.",
    category: "Traditionnel"
  },

  {
    _id: 41,
    name: "Tarte Citron",
    image: lemontart,
    price: 100,
    description: "Tarte au citron acidulée avec pâte sablée croustillante et crème citron légère.",
    category: "Dessert"
  },
  {
    _id: 42,
    name: "Gâteau au chocolat",
    image: chocolatecake,
    price: 150,
    description: "Gâteau au chocolat fondant et moelleux avec une texture riche et gourmande.",
    category: "Dessert"
  },
  {
    _id: 43,
    name: "Cheesecake",
    image: cheesecake,
    price: 250,
    description: "Gâteau au fromage crémeux sur base biscuitée, légèrement sucré et fondant.",
    category: "Dessert"
  },
  {
    _id: 44,
    name: "Tiramisu",
    image: tiramisu,
    price: 250,
    description: "Dessert italien à base de café, mascarpone et cacao, doux et onctueux.",
    category: "Dessert"
  },
  {
    _id: 45,
    name: "Gelato au chocolat",
    image: chocogelato,
    price: 140,
    description: "Glace italienne au chocolat intense, crémeuse et rafraîchissante.",
    category: "Dessert"
  },

  {
    _id: 46,
    name: "Iced Tea",
    image: icedtea,
    price: 100,
    description: "Thé glacé rafraîchissant, légèrement sucré avec une touche de citron.",
    category: "Boissons"
  },
  {
    _id: 47,
    name: "Café",
    image: coffe,
    price: 250,
    description: "Café chaud intense et aromatique, parfait pour un moment de pause.",
    category: "Boissons"
  },
  {
    _id: 48,
    name: "Soda au citron",
    image: lemon,
    price: 100,
    description: "Une boisson gazeuse rafraîchissante au goût de citron, servie bien fraîche avec des glaçons.",
    category: "Boissons"
  },
  {
    _id: 49,
    name: "Milkshake au chocolat",
    image: chocolatemilkshake,
    price: 150,
    description: " Milkshake onctueux au chocolat, frais et gourmand.",
    category: "Boissons"
  },
  {
    _id: 50,
    name: "Lait",
    image: milk,
    price: 200,
    description: "Lait frais simple.",
    category: "Boissons"
  },
  {
    _id: 51,
    name: "Jus Orange",
    image: orangejuice,
    price: 150,
    description: "Jus d’orange frais.",
    category: "Boissons"
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








