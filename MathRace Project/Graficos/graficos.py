import pandas as pd
import matplotlib.pyplot as plt
from pymongo import MongoClient
from datetime import date
import os

def get_data_from_mongodb():
    client = MongoClient('mongodb+srv://dangon:1234@mathrace.fccxlpg.mongodb.net/?appName=MathRace')
    db = client['grup4']
    collection = db['preguntes']
    data = pd.DataFrame(list(collection.find()))
    return data

def generar_grafico_acertadas(df):
    df_acertadas = df.sort_values('nAcertada', ascending=False).head(10)
    plt.bar(df_acertadas['id'].astype(str), df_acertadas['nAcertada'])
    plt.title('Top 10 preguntas más acertadas')
    plt.xlabel('ID de la pregunta')
    plt.ylabel('Número de aciertos')
    nom = 'Grafico Preguntas Acertadas'
    plt.savefig(os.path.join('../M10/grafics', nom + '.jpeg'), bbox_inches='tight')
    plt.close('all')

def generar_grafico_falladas(df):
    df_falladas = df.sort_values('nFallada', ascending=False).head(10)
    plt.bar(df_falladas['id'].astype(str), df_falladas['nFallada'])
    plt.title('Top 10 preguntas más falladas')
    plt.xlabel('ID de la pregunta')
    plt.ylabel('Número de fallos')
    nom = 'Grafico Preguntas Falladas'
    plt.savefig(os.path.join('../M10/grafics', nom + '.jpeg'), bbox_inches='tight')
    plt.close('all')

def generar_grafico_acertadas_por_dificultad(df):
    df_acertadas = df.groupby('nivel')['nAcertada'].sum()
    plt.bar(df_acertadas.index, df_acertadas.values)
    plt.title('Número de preguntas acertadas por nivel de dificultad')
    plt.xlabel('Nivel de dificultad')
    plt.ylabel('Número de aciertos')
    nom = 'Grafico Preguntas Acertadas Por Dificultad'
    plt.savefig(os.path.join('../M10/grafics', nom + '.jpeg'), bbox_inches='tight')
    plt.close('all')

def generar_grafico_falladas_por_dificultad(df):
    df_falladas = df.groupby('nivel')['nFallada'].sum()
    plt.bar(df_falladas.index, df_falladas.values)
    plt.title('Número de preguntas falladas por nivel de dificultad')
    plt.xlabel('Nivel de dificultad')
    plt.ylabel('Número de fallos')
    nom = 'Grafico Preguntas Falladas Por Dificultad'
    plt.savefig(os.path.join('../M10/grafics', nom + '.jpeg'), bbox_inches='tight')
    plt.close('all')

df = get_data_from_mongodb()
generar_grafico_acertadas(df)
generar_grafico_falladas(df)
generar_grafico_acertadas_por_dificultad(df)
generar_grafico_falladas_por_dificultad(df)

