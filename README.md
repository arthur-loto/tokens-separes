# tokens-separes
Tokens figma separés

Dépendances : 
* Style-dictionary version 
* Token-Transformer (mais peut aussi être chargé via commande npx)

Désormais on a des fichiers séparés venant de Figma qui sont tous le répertoire 'sets'
Certains fichiers comme $metadata.json ou $themes.json servent uniquement pour Figma, donc pas besoin de les manipuler

Les autres fichiers sont nécessaires pour consturire les jeux de tokens css / saas / iOS / Android

Pour que style dictionary fonctionne correctement, il faut toujours avoir le options.json dans le processus de création des fichiers json (pour n'importe quelle marque)
Cette info ne sert que pour la génération des fichiers, style-dictionary étant configuré (via le build.js) pour éliminer ensuite les tokens d'options.


Commande complètes pour Token transformer

https://www.npmjs.com/package/token-transformer 

npx token-transformer source destination fichiers,a,inclure fichiers,a,exclure --autres_parametres


Exemple de création de decisions-jel en utilisant tous les jeux tokens disponibles et utiles spécifiquement pour cette marque avec expandTypography.

npx token-transformer sets transformer-output/decisions-jel.json options,actions-jel,collections-jel,resources-jel,templates-jel global --expandTypography=true



Au fur et à mesure que d'autres sets s'ajouteront il faudra compléter la liste.

Dans nos projets la(les) commande(s) npx token-transformer se font normalement dans le CI/CD. Mais on peut les executer localement à des fins de tests. 

On exécute ensuite le fichier build.js via la commande node build.js 