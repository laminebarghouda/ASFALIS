const esConnection = require('./connection')
const AMM = [
    {
        specialite : "ACCOFIL",
        dosage : "30 MU",
        forme : "Solution injectable",
        presentation : "B/5/0.5 ml",
        conditionnement_primaire : "Seringue pré-remplie",
        specification : "en verre type I",
        dci : "FILGRASTIM",
        classement_VEIC : "Vital",
        classe_therapeutique : "ANTINEOPLASIQUES ET IMMUNOMODULATEURS",
        sous_classe : "IMMUNOSTIMULANTS",
        laboratoire : "ACCORD HEALTHCARE LTD",
        tableau : "A",
        duree_conservation : "36 (mois)",
        indication : "ACCOFIL est indiqué pour la réduction de la durée des neutropénies et de l'incidence des neutropénies fébriles chez les patients traités par une chimiothérapie cytotoxique pour une pathologie maligne (à l'exception des leucémies myéloïdes chroniques et des syndromes myélodysplasiques) et dans la réduction de la durée des neutropénies chez les patients recevant une thérapie myélosuppressive suivie d'une greffe de moelle osseuse et présentant un risque accru de neutropénie sévère prolongée. L'innocuité et l'efficacité du filgrastim sont similaires chez l'adulte et chez l'enfant recevant une chimiothérapie cytotoxique. ACCOFIL est indiqué pour la mobilisation de cellules souches progénitrices (CSP) dans le sang circulant. Chez les patients, enfants ou adultes atteints de neutropénie sévère congénitale, cyclique ou idiopathique avec un taux de polynucléaires neutrophiles (PNN) = 0,5 x 109/l et des antécédents d'infections sévères ou récurrentes, l'administration à long terme de Accofil est indiquée pour augmenter le taux de neutrophiles et pour réduire l'incidence et la durée des épisodes infectieux. ACCOFIL est indiqué dans le traitement des neutropénies persistantes (PNN = 1,0 x 109/l) chez les patients infectés par le VIH à un stade avancé, afin de réduire le risque d'infection bactérienne quand les autres options thérapeutiques sont inadéquates.",
        generique_princeps : "Biosimilaire",
        amm : "16923101H",
        date_amm : "2017-06-28",
    },
    {
        specialite : "ACIDE ZOLÉDRONIQUE ACCORD",
        dosage : "4 MG/5 ML",
        forme : "Solution injectable",
        presentation : "B/1 flacon",
        conditionnement_primaire : "Flacon",
        specification : "en plastique en copolymère claire +capsule+capsule ALU",
        dci : "ACIDE ZOLÉDRONIQUE",
        classement_VEIC : "Essentiel",
        classe_therapeutique : "MUSCLE ET SQUELETTE",
        sous_classe : "MEDICAMENTS POUR LES MALADIES DES OS",
        laboratoire : "ACCORD HEALTHCARE LTD",
        tableau : "A",
        duree_conservation : "30 (mois)",
        indication : "Traitement des patients présentant des métastases osseuses de tumeurs solides et lors de myélome multiple en association à un traitement antinéoplasique standard. Traitement de l'hypercalcémie maligne(HCM).",
        generique_princeps : "Générique",
        amm : "16923081H",
        date_amm : "2017-06-16",
    },
    {
        specialite : "EXTRAITS ALLERGENIQUES",
        dosage : "1;10;100; 300IR",
        forme : "Gouttes buvables",
        presentation : "COF/4FL/10ml+pipette graduée",
        conditionnement_primaire : "Flacon",
        specification : "en verre brun+pipette graduée",
        dci : "ALLERGENES",
        classement_VEIC : "Confort",
        classe_therapeutique : "DIVERS",
        sous_classe : "ALLERGENES",
        laboratoire : "ALLERBIO S.A",
        tableau : "Aucun tableau",
        duree_conservation : "12 (mois)",
        indication : "Ce médicament est destiné à la vaccination par immunothérapie spécifique des patients présentant une hypersensibilité de type I avec par exemple des signes de conjonctivite, de rhinite ou d'asthme allergique.",
        generique_princeps : "Princeps",
        amm : "4913021",
        date_amm : "2005-10-01",
    },
    {
        specialite : "CETROTIDE",
        dosage : "3 MG",
        forme : "Pdre p.prep.injectable",
        presentation : "B/1FL+SER/3ML",
        conditionnement_primaire : "Flacon",
        specification : "en verre +seringue en verre",
        dci : "CETRORELIX",
        classement_VEIC : "Essentiel",
        classe_therapeutique : "HORMONES SYSTEMIQUES, HORMONES SEXUELLES EXCLUES",
        sous_classe : "HORMONES HYPOPHYSAIRES, HYPOTHALAMIQUES ET ANALOGUES",
        laboratoire : "MERCK SERONO EUROPE Limited UK",
        tableau : "A",
        duree_conservation : "24 (mois)",
        indication : "Prévention de l'ovulation prématurée chez les patientes incluses dans un protocole de stimulation ovarienne contrôlée, suivie de prélèvement d'ovocytes et de techniques de reproduction assistée. Dans les études cliniques, cetrotide 3 mg a été associé à la gonadotrophine de femme ménauposée (HMG), cependant l'expérience plus réduite acquise avec la FSH recombinante suggère une efficacité équivalente.",
        generique_princeps : "Princeps",
        amm : "4703022",
        date_amm : "2003-05-05",
    },
    {
        specialite : "CETROTIDE",
        dosage : "0.25 MG",
        forme : "Pdre p.prep.injectable",
        presentation : "B/1FL+SER/1ML",
        conditionnement_primaire : "Flacon",
        specification : "en verre +seringue en verre",
        dci : "CETRORELIX",
        classement_VEIC : "Essentiel",
        classe_therapeutique : "HORMONES SYSTEMIQUES, HORMONES SEXUELLES EXCLUES",
        sous_classe : "HORMONES HYPOPHYSAIRES, HYPOTHALAMIQUES ET ANALOGUES",
        laboratoire : "MERCK SERONO EUROPE Limited UK",
        tableau : "A",
        duree_conservation : "24 (mois)",
        indication : "Prévention de l'ovulation prématurée chez les patientes incluses dans un protocole de stimulation ovarienne contrôlée, suivie de prélèvement d'ovocytes et de techniques de reproduction assistée. Dans les études cliniques, cetrotide 0.25 mg a été associé à la gonadotrophine de femme ménauposée (HMG), cependant l'expérience plus réduite acquise avec la FSH recombinante suggère une efficacité équivalente.",
        generique_princeps : "Princeps",
        amm : "4703021",
        date_amm : "2003-05-05",
    },
        {
        specialite : "DRIPTANE",
        dosage : "5 MG",
        forme : "Comprimé sécable",
        presentation : "B/60",
        conditionnement_primaire : "Blister",
        specification : "en verre +seringue en verre",
        dci : "OXYBUTYNINE",
        classement_VEIC : "Intermédiaire",
        classe_therapeutique : "SYSTEME GENITO URINAIRE ET HORMONES SEXUELLES",
        sous_classe : "MEDICAMENTS UROLOGIQUES",
        laboratoire : "FOURNIER S.A",
        tableau : "C",
        duree_conservation : "24 (mois)",
        indication : "Incontinence urinaire, impériosité urinaire et pollakiurie en cas d'instabilité vésicale pouvant résulter d'une instabilité idiopathique du détrusor ou d'atteintes vésicales neurogènes.",
        generique_princeps : "Générique",
        amm : "5413021",
        date_amm : "1996-08-08",
    },
]

/** Clear ES index, parse and index all AMMs from the array */
async function insertFreshAMMs () {
    await esConnection.checkConnection()

    try {
        // Clear previous ES index
        await esConnection.resetIndex()

        console.log(`Will insert ${AMM.length} AMMs`)

        // Read each book file, and index each paragraph in elasticsearch
        for (let amm of AMM) {
            await esConnection.client.index({
                index : 'authority',
                type : "amm",
                refresh: true,
                id : amm.amm,
                body: amm
            })
        }
    } catch (err) {
        console.error(err)
    }
}



async function run() {
    await insertFreshAMMs()

    const result = await esConnection.client.count({ index : esConnection.index, type : esConnection.type })
    console.log('count', result)
}

run()
