const { MongoClient } = require("mongodb");
module.exports = { getPreguntas, deletePregunta, updatePregunta, insertPregunta, updatePreguntaAcertada};

const url = "mongodb+srv://dangon:1234@mathrace.fccxlpg.mongodb.net/?appName=MathRace";
const client = new MongoClient(url);

const preguntas = [
  {
    "id": 1,
    "nivel": "facil",
    "pregunta": "Quina és la solució de l'equació 3x + 5 = 14?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 3"},
      {"opcion": "B", "texto": "x = 2"},
      {"opcion": "C", "texto": "x = 4"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = 3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 2,
    "nivel": "medio",
    "pregunta": "Resol l'equació 2x^2 - 8 = 0.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 2"},
      {"opcion": "B", "texto": "x = -2"},
      {"opcion": "C", "texto": "x = -1"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = -2",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 3,
    "nivel": "dificil",
    "pregunta": "Quina és la solució de l'equació 4(x - 3) = 16?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 4"},
      {"opcion": "B", "texto": "x = 5"},
      {"opcion": "C", "texto": "x = 6"},
      {"opcion": "D", "texto": "x = 7"}
    ],
    "answer": "x = 7",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 4,
    "nivel": "facil",
    "pregunta": "Resol l'equació 2/3 * (x - 6) = 4.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 15"},
      {"opcion": "B", "texto": "x = 12"},
      {"opcion": "C", "texto": "x = 10"},
      {"opcion": "D", "texto": "x = 9"}
    ],
    "answer": "x = 12",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 5,
    "nivel": "medio",
    "pregunta": "Quina és la solució de l'equació 5x + 2 = 3x + 8?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 1"},
      {"opcion": "B", "texto": "x = 2"},
      {"opcion": "C", "texto": "x = 4"},
      {"opcion": "D", "texto": "x = 3"}
    ],
    "answer": "x = 3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 6,
    "nivel": "dificil",
    "pregunta": "Resol l'equació 3x^2 + 6x = 0.",
    "respuestas": [
      {"opcion": "A", "texto": "x = -3"},
      {"opcion": "B", "texto": "x = 0"},
      {"opcion": "C", "texto": "x = 2"},
      {"opcion": "D", "texto": "x = -2"}
    ],
    "answer": "x = -2",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 7,
    "nivel": "facil",
    "pregunta": "Quina és la solució de l'equació 2(x + 4) = 10?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 2"},
      {"opcion": "B", "texto": "x = 5"},
      {"opcion": "C", "texto": "x = 3"},
      {"opcion": "D", "texto": "x = 6"}
    ],
    "answer": "x = 3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 8,
    "nivel": "medio",
    "pregunta": "Resol l'equació (1/2) * (x - 1) = 3.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 6"},
      {"opcion": "B", "texto": "x = 8"},
      {"opcion": "C", "texto": "x = 7"},
      {"opcion": "D", "texto": "x = 5"}
    ],
    "answer": "x = 6",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 9,
    "nivel": "dificil",
    "pregunta": "Quina és la solució de l'equació 3x - 7 = 8?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 6"},
      {"opcion": "B", "texto": "x = 3"},
      {"opcion": "C", "texto": "x = 4"},
      {"opcion": "D", "texto": "x = 5"}
    ],
    "answer": "x = 5",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 10,
    "nivel": "facil",
    "pregunta": "Resol l'equació 4x^2 - 16 = 0.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 2"},
      {"opcion": "B", "texto": "x = -2"},
      {"opcion": "C", "texto": "x = -1"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = -2",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 11,
    "nivel": "facil",
    "pregunta": "Quina és la solució de l'equació 2x - 3 = 5?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 2"},
      {"opcion": "B", "texto": "x = 4"},
      {"opcion": "C", "texto": "x = 3"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = 4",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 12,
    "nivel": "medio",
    "pregunta": "Resol l'equació 3/2 * (x + 2) = 9.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 3"},
      {"opcion": "B", "texto": "x = 6"},
      {"opcion": "C", "texto": "x = 4"},
      {"opcion": "D", "texto": "x = 5"}
    ],
    "answer": "x = 3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 13,
    "nivel": "dificil",
    "pregunta": "Quina és la solució de l'equació 5(x - 2) = 3(x + 1)?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 4"},
      {"opcion": "B", "texto": "x = 5"},
      {"opcion": "C", "texto": "x = 6"},
      {"opcion": "D", "texto": "x = 7"}
    ],
    "answer": "x = 6",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 14,
    "nivel": "facil",
    "pregunta": "Resol l'equació 4/5 * (x - 2) = 6.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 9"},
      {"opcion": "B", "texto": "x = 10"},
      {"opcion": "C", "texto": "x = 8"},
      {"opcion": "D", "texto": "x = 7"}
    ],
    "answer": "x = 8",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 15,
    "nivel": "medio",
    "pregunta": "Quina és la solució de l'equació 2x + 7 = 5x - 1?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 3"},
      {"opcion": "B", "texto": "x = 4"},
      {"opcion": "C", "texto": "x = 2"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = 2",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 16,
    "nivel": "dificil",
    "pregunta": "Resol l'equació 2x^2 + 5x = 0.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 0"},
      {"opcion": "B", "texto": "x = -5"},
      {"opcion": "C", "texto": "x = 2"},
      {"opcion": "D", "texto": "x = -2"}
    ],
    "answer": "x = 0",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 17,
    "nivel": "facil",
    "pregunta": "Quina és la solució de l'equació 3(x + 1) = 12?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 3"},
      {"opcion": "B", "texto": "x = 2"},
      {"opcion": "C", "texto": "x = 4"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = 3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 18,
    "nivel": "medio",
    "pregunta": "Resol l'equació (3/4) * (x - 2) = 7.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 10"},
      {"opcion": "B", "texto": "x = 9"},
      {"opcion": "C", "texto": "x = 8"},
      {"opcion": "D", "texto": "x = 6"}
    ],
    "answer": "x = 10",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 19,
    "nivel": "dificil",
    "pregunta": "Quina és la solució de l'equació 4x - 5 = 7?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 2"},
      {"opcion": "B", "texto": "x = 3"},
      {"opcion": "C", "texto": "x = 4"},
      {"opcion": "D", "texto": "x = 5"}
    ],
    "answer": "x = 4",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 20,
    "nivel": "facil",
    "pregunta": "Resol l'equació 2x^2 - 9 = 0.",
    "respuestas": [
      {"opcion": "A", "texto": "x = -3"},
      {"opcion": "B", "texto": "x = 3"},
      {"opcion": "C", "texto": "x = -1"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = 3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 21,
    "nivel": "facil",
    "pregunta": "Quina és la solució de l'equació 4(x + 2) = 20?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 3"},
      {"opcion": "B", "texto": "x = 5"},
      {"opcion": "C", "texto": "x = 4"},
      {"opcion": "D", "texto": "x = 6"}
    ],
    "answer": "x = 4",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 22,
    "nivel": "medio",
    "pregunta": "Resol l'equació (2/3) * (x - 5) = 3.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 8"},
      {"opcion": "B", "texto": "x = 6"},
      {"opcion": "C", "texto": "x = 7"},
      {"opcion": "D", "texto": "x = 9"}
    ],
    "answer": "x = 8",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 23,
    "nivel": "dificil",
    "pregunta": "Quina és la solució de l'equació 2x^2 - 6x = 0?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 0"},
      {"opcion": "B", "texto": "x = 3"},
      {"opcion": "C", "texto": "x = 2"},
      {"opcion": "D", "texto": "x = -2"}
    ],
    "answer": "x = 3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 24,
    "nivel": "facil",
    "pregunta": "Resol l'equació 3/4 * (x + 1) = 5.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 4"},
      {"opcion": "B", "texto": "x = 6"},
      {"opcion": "C", "texto": "x = 3"},
      {"opcion": "D", "texto": "x = 2"}
    ],
    "answer": "x = 4",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 25,
    "nivel": "medio",
    "pregunta": "Quina és la solució de l'equació 6x - 2 = 3x + 4?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 2"},
      {"opcion": "B", "texto": "x = 4"},
      {"opcion": "C", "texto": "x = 3"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = 2",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 26,
    "nivel": "dificil",
    "pregunta": "Resol l'equació 4x^2 + 12x = 0.",
    "respuestas": [
      {"opcion": "A", "texto": "x = -3"},
      {"opcion": "B", "texto": "x = 0"},
      {"opcion": "C", "texto": "x = 2"},
      {"opcion": "D", "texto": "x = -2"}
    ],
    "answer": "x = -3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 27,
    "nivel": "facil",
    "pregunta": "Quina és la solució de l'equació 2(x - 3) = 8?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 4"},
      {"opcion": "B", "texto": "x = 5"},
      {"opcion": "C", "texto": "x = 3"},
      {"opcion": "D", "texto": "x = 6"}
    ],
    "answer": "x = 5",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 28,
    "nivel": "medio",
    "pregunta": "Resol l'equació (1/2) * (x + 4) = 3.",
    "respuestas": [
      {"opcion": "A", "texto": "x = 8"},
      {"opcion": "B", "texto": "x = 6"},
      {"opcion": "C", "texto": "x = 7"},
      {"opcion": "D", "texto": "x = 5"}
    ],
    "answer": "x = 8",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 29,
    "nivel": "dificil",
    "pregunta": "Quina és la solució de l'equació 5x - 9 = 6?",
    "respuestas": [
      {"opcion": "A", "texto": "x = 3"},
      {"opcion": "B", "texto": "x = 2"},
      {"opcion": "C", "texto": "x = 4"},
      {"opcion": "D", "texto": "x = 5"}
    ],
    "answer": "x = 3",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 30,
    "nivel": "facil",
    "pregunta": "Resol l'equació 3x^2 - 27 = 0.",
    "respuestas": [
      {"opcion": "A", "texto": "x = -3"},
      {"opcion": "B", "texto": "x = 3"},
      {"opcion": "C", "texto": "x = -1"},
      {"opcion": "D", "texto": "x = 1"}
    ],
    "answer": "x = -3",
    "nAcertada": 0,
    "nFallada": 0
  }

];

const preguntasNuevas = [
  {
    "id": 1,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 2 * 2 + 10",
    "respuestas": [
      { "opcion": "A", "texto": "6" },
      { "opcion": "B", "texto": "7" },
      { "opcion": "C", "texto": "14" },
      { "opcion": "D", "texto": "9" }
    ],
    "answer": "14",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 2,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 13 + 2 * 3",
    "respuestas": [
      { "opcion": "A", "texto": "32" },
      { "opcion": "B", "texto": "45" },
      { "opcion": "C", "texto": "40" },
      { "opcion": "D", "texto": "50" }
    ],
    "answer": "45",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 3,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 5 * 2 + 1",
    "respuestas": [
      { "opcion": "A", "texto": "10" },
      { "opcion": "B", "texto": "11" },
      { "opcion": "C", "texto": "12" },
      { "opcion": "D", "texto": "13" }
    ],
    "answer": "11",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 4,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 1 + 7 * 4",
    "respuestas": [
      { "opcion": "A", "texto": "16" },
      { "opcion": "B", "texto": "25" },
      { "opcion": "C", "texto": "29" },
      { "opcion": "D", "texto": "32" }
    ],
    "answer": "29",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 5,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 4 * 2 + 5",
    "respuestas": [
      { "opcion": "A", "texto": "8" },
      { "opcion": "B", "texto": "9" },
      { "opcion": "C", "texto": "10" },
      { "opcion": "D", "texto": "13" }
    ],
    "answer": "13",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 6,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 2 * 6 + 3",
    "respuestas": [
      { "opcion": "A", "texto": "6" },
      { "opcion": "B", "texto": "17" },
      { "opcion": "C", "texto": "16" },
      { "opcion": "D", "texto": "9" }
    ],
    "answer": "16",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 7,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 3 * 3 + 2 * 2",
    "respuestas": [
      { "opcion": "A", "texto": "11" },
      { "opcion": "B", "texto": "12" },
      { "opcion": "C", "texto": "13" },
      { "opcion": "D", "texto": "14" }
    ],
    "answer": "13",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 8,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 4 * 2 + 5",
    "respuestas": [
      { "opcion": "A", "texto": "12" },
      { "opcion": "B", "texto": "13" },
      { "opcion": "C", "texto": "14" },
      { "opcion": "D", "texto": "15" }
    ],
    "answer": "13",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 9,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 5 + 5 * 2",
    "respuestas": [
      { "opcion": "A", "texto": "15" },
      { "opcion": "B", "texto": "16" },
      { "opcion": "C", "texto": "17" },
      { "opcion": "D", "texto": "18" }
    ],
    "answer": "15",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 10,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 6 * 2 + 3 * 3",
    "respuestas": [
      { "opcion": "A", "texto": "18" },
      { "opcion": "B", "texto": "19" },
      { "opcion": "C", "texto": "20" },
      { "opcion": "D", "texto": "21" }
    ],
    "answer": "21",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 11,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 9 * 8 - (7 + 6)",
    "respuestas": [
      { "opcion": "A", "texto": "65" },
      { "opcion": "B", "texto": "66" },
      { "opcion": "C", "texto": "67" },
      { "opcion": "D", "texto": "68" }
    ],
    "answer": "65",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 12,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 7 * 6 - (5 + 4)",
    "respuestas": [
      { "opcion": "A", "texto": "35" },
      { "opcion": "B", "texto": "36" },
      { "opcion": "C", "texto": "37" },
      { "opcion": "D", "texto": "38" }
    ],
    "answer": "35",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 13,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 5 * 4 - (3 + 2)",
    "respuestas": [
      { "opcion": "A", "texto": "15" },
      { "opcion": "B", "texto": "16" },
      { "opcion": "C", "texto": "17" },
      { "opcion": "D", "texto": "18" }
    ],
    "answer": "15",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 14,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 9 * (8 + 7) - 10",
    "respuestas": [
      { "opcion": "A", "texto": "125" },
      { "opcion": "B", "texto": "126" },
      { "opcion": "C", "texto": "127" },
      { "opcion": "D", "texto": "128" }
    ],
    "answer": "125",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 15,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 6 * (5 + 4) - 7",
    "respuestas": [
      { "opcion": "A", "texto": "47" },
      { "opcion": "B", "texto": "48" },
      { "opcion": "C", "texto": "49" },
      { "opcion": "D", "texto": "50" }
    ],
    "answer": "47",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 16,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 5 * (2 + 3)",
    "respuestas": [
      { "opcion": "A", "texto": "20" },
      { "opcion": "B", "texto": "22" },
      { "opcion": "C", "texto": "25" },
      { "opcion": "D", "texto": "30" }
    ],
    "answer": "25",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 17,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 3 * (3 + 2) - 4",
    "respuestas": [
      { "opcion": "A", "texto": "11" },
      { "opcion": "B", "texto": "12" },
      { "opcion": "C", "texto": "13" },
      { "opcion": "D", "texto": "14" }
    ],
    "answer": "11",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 18,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 4 * (2 + 5) - 6 * 2",
    "respuestas": [
      { "opcion": "A", "texto": "16" },
      { "opcion": "B", "texto": "17" },
      { "opcion": "C", "texto": "18" },
      { "opcion": "D", "texto": "19" }
    ],
    "answer": "18",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 19,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 5 * (5 + 2) - 7 * 2",
    "respuestas": [
      { "opcion": "A", "texto": "24" },
      { "opcion": "B", "texto": "25" },
      { "opcion": "C", "texto": "26" },
      { "opcion": "D", "texto": "27" }
    ],
    "answer": "26",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 20,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 6 * (3 + 3) - 4 * 2",
    "respuestas": [
      { "opcion": "A", "texto": "30" },
      { "opcion": "B", "texto": "31" },
      { "opcion": "C", "texto": "32" },
      { "opcion": "D", "texto": "33" }
    ],
    "answer": "32",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 21,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 4 * (6 + 3) - 8 * 2",
    "respuestas": [
      { "opcion": "A", "texto": "24" },
      { "opcion": "B", "texto": "25" },
      { "opcion": "C", "texto": "26" },
      { "opcion": "D", "texto": "27" }
    ],
    "answer": "26",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 22,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 7 * (4 + 2) - 5 * 3",
    "respuestas": [
      { "opcion": "A", "texto": "30" },
      { "opcion": "B", "texto": "31" },
      { "opcion": "C", "texto": "32" },
      { "opcion": "D", "texto": "33" }
    ],
    "answer": "32",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 23,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 5 * (7 + 2) - 9 * 2",
    "respuestas": [
      { "opcion": "A", "texto": "28" },
      { "opcion": "B", "texto": "29" },
      { "opcion": "C", "texto": "30" },
      { "opcion": "D", "texto": "31" }
    ],
    "answer": "29",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 24,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 6 * (5 + 3) - 7 * 3",
    "respuestas": [
      { "opcion": "A", "texto": "33" },
      { "opcion": "B", "texto": "34" },
      { "opcion": "C", "texto": "35" },
      { "opcion": "D", "texto": "36" }
    ],
    "answer": "35",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 25,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 7 * (6 + 4) - 8 * 3",
    "respuestas": [
      { "opcion": "A", "texto": "38" },
      { "opcion": "B", "texto": "39" },
      { "opcion": "C", "texto": "40" },
      { "opcion": "D", "texto": "41" }
    ],
    "answer": "40",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 26,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 8 * (7 + 5) - 9 * 4",
    "respuestas": [
      { "opcion": "A", "texto": "43" },
      { "opcion": "B", "texto": "44" },
      { "opcion": "C", "texto": "45" },
      { "opcion": "D", "texto": "46" }
    ],
    "answer": "45",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 26,
    "nivel": "facil",
    "pregunta": "Resol l'operació: 7 + 4 * 3",
    "respuestas": [
      { "opcion": "A", "texto": "15" },
      { "opcion": "B", "texto": "16" },
      { "opcion": "C", "texto": "17" },
      { "opcion": "D", "texto": "19" }
    ],
    "answer": "19",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 27,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 5 * (5 + 2) - 4",
    "respuestas": [
      { "opcion": "A", "texto": "24" },
      { "opcion": "B", "texto": "29" },
      { "opcion": "C", "texto": "31" },
      { "opcion": "D", "texto": "33" }
    ],
    "answer": "31",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 28,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 10 * 4 - (3 + 2)",
    "respuestas": [
      { "opcion": "A", "texto": "35" },
      { "opcion": "B", "texto": "40" },
      { "opcion": "C", "texto": "34" },
      { "opcion": "D", "texto": "33" }
    ],
    "answer": "35",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 29,
    "nivel": "medio",
    "pregunta": "Resol l'operació: 4 * 4 - (3 + 2) -3",
    "respuestas": [
      { "opcion": "A", "texto": "8" },
      { "opcion": "B", "texto": "10" },
      { "opcion": "C", "texto": "14" },
      { "opcion": "D", "texto": "13" }
    ],
    "answer": "8",
    "nAcertada": 0,
    "nFallada": 0
  },
  {
    "id": 30,
    "nivel": "dificil",
    "pregunta": "Resol l'operació: 10 * (8 + 4) - 10 * 2",
    "respuestas": [
      { "opcion": "A", "texto": "105" },
      { "opcion": "B", "texto": "100" },
      { "opcion": "C", "texto": "99" },
      { "opcion": "D", "texto": "98" }
    ],
    "answer": "100",
    "nAcertada": 0,
    "nFallada": 0
  }
];



/*async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");

        // Obtén la base de datos (reemplaza "miBaseDeDatos" con el nombre de tu base de datos)
        const db = client.db("grup4");

        // Crea una colección llamada "preguntas"
        const collection = db.collection("preguntes");

        // Inserta todas las preguntas en la colección
        const result = await collection.insertMany(preguntas);

        console.log(`Successfully inserted ${result.insertedCount} items!`);
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
} 
run().catch(console.dir);*/

async function getPreguntas() {
    try {
        await client.connect();
        const db = client.db("grup4");
        const collection = db.collection("preguntes");
        const preguntas = await collection.find().toArray();
        return preguntas; // Devuelve las preguntas
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}


async function deletePregunta(id) {
  try {
      await client.connect();
      const pregunta_id_int = parseInt(id);

      const db = client.db("grup4");
      const collection = db.collection("preguntes");
      const result = await collection.deleteOne({ "id": pregunta_id_int });
      console.log(`Se eliminaron ${result.deletedCount} preguntas`);
      
      if (result.deletedCount === 1) {
        // Éxito: se eliminó una pregunta
        return { success: true, message: 'Pregunta eliminada exitosamente.' };
    } else {
        // No se encontró una pregunta con el ID proporcionado
        return { success: false, message: 'No se encontró una pregunta con el ID proporcionado.' };
    }
  } catch (err) {
      console.log(err.stack);
  }
  finally {
      await client.close();
  }
}

async function updatePregunta(id, newPregunta) {
  try {
      await client.connect();
      const pregunta_id_int = parseInt(id);
      const db = client.db("grup4");
      const collection = db.collection("preguntes");

      const result = await collection.updateOne({ "id": pregunta_id_int }, { $set: newPregunta });
      console.log(result);

      return result; // Devuelve el resultado de la operación de actualización
  } catch (err) {
      console.log(err.stack);
  }
  finally {
      await client.close();
  }
}

async function updatePreguntaAcertada(id, acertada) {
  try {
      console.log(`ID: ${id}, Acertada: ${acertada.acertada}`); // Modifica esta línea
      await client.connect();
      const pregunta_id_int = parseInt(id);
      const db = client.db("grup4");
      const collection = db.collection("preguntes");
      let result = null;
      if (acertada.acertada == true) { // Modifica esta línea
        console.log('Incrementando nAcertada');
        result = await collection.updateOne({ "id": pregunta_id_int }, { $inc: { "nAcertada": 1 } });
      } else {
        console.log('Incrementando nFallada');
        result = await collection.updateOne({ "id": pregunta_id_int }, { $inc: { "nFallada": 1 } });
      }

      console.log(result);
      return result; 
  } catch (err) {
      console.log(err.stack);
  }
  finally {
      await client.close();
  }
}




async function insertPregunta(newPregunta) {
  try {
      await client.connect();

      const db = client.db("grup4");
      const collection = db.collection("preguntes");

      const cantidadDePreguntas = await collection.countDocuments();
      newPregunta.id = cantidadDePreguntas + 1;
      newPregunta.nAcertada = 0;
      newPregunta.nFallada = 0;

      const result = await collection.insertOne(newPregunta);

      return result; // Devuelve el resultado de la operación de inserción
  } catch (err) {
      console.log(err.stack);
  }
  finally {
      await client.close();
  }
}
