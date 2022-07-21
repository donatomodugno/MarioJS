#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>


#define FILE_IN  "level_in.txt"
#define FILE_OUT "level_out.txt"
#define MAX_PLATFORMS 50
#define MIN_PLATFORMS 10

/** LIMITI DELLA MAPPA **/
#define MIN_X   1
#define MAX_X 100
#define MIN_Y   1
#define MAX_Y  17

/** ID dei blocchi **/
#define N_ID        2 //numero totale dei possibili ID
#define GROUND_ID   1
#define LAVA_ID     2

/** ID degli npc **/
#define PEACH_ID  0
#define GOOMBA_ID 1

/** Velocit� degli npc **/
#define MAX_V 1
#define GOOMBA_VX 1

/***Legenda lettura file .txt per generazione livello:

    g: ground (id = 1)
    l: lava   (id = 2)
    b: block
    p: platform
    0: none

***/
int numeroCifre(int n);

void generateBlock(int, int, int, FILE*);
void generateBlockStairs(int start_x, int start_y, int step_x, int step_y, int n, int nSteps, FILE *fp);

void printRandomPlatforms(int, FILE*);
void generatePlatform(int, int, int, FILE*);
void generatePlatformStairs(int start_x, int start_y, int step_x, int step_y, int n, int nPlatforms, FILE *fp);


char **blocks, **platforms, **npcs;

void printRandomPlatforms(int nPlatforms, FILE *fp){

    int i;
    int x = 0, y = 0, n = 0;

    fprintf(fp, "platform:[\n");
    for(i=0; i<nPlatforms; i++){

        x = rand() % MAX_X + 1;
        if(x < MIN_X)
            x = MIN_X;

        y = rand() % MAX_Y + 1;
        if(y < MIN_Y)
            y = MIN_Y;

        n = rand() % 5 + 1;

        if(x >= MIN_X && x <= MAX_X && y>= MIN_Y && y <= MAX_Y)
            generatePlatform(x, y, n, fp);

    }
    fprintf(fp, "]");


}

void generatePlatformStairs(int start_x, int start_y, int step_x, int step_y, int n, int nPlatforms, FILE *fp){

    int i;
    int x = start_x, y = start_y;

    for(i=0; i<nPlatforms; i++){

        if(x >= MIN_X && x <= MAX_X && y >= MIN_Y && y <= MAX_Y){

            generatePlatform(x, y, n, fp);
            fprintf(fp, ",\n");

            x = x + n + step_x;
            y = y + step_y;

        }

    }
}

void generatePlatform(int x, int y, int n, FILE *fp){

    fprintf(fp, "\t{x:%d,y:%d,n:%d}", x, y, n);

}

/*** "n" � il numero di blocchi per ogni gradino della scala **/
void generateBlockStairs(int start_x, int start_y, int step_x, int step_y, int n, int nSteps, FILE *fp){

    int i, k, j;
    int x = start_x, y = start_y;

    /***Numero di gradini della scala***/
    for(i=0; i<nSteps; i++){
        /***Numero di blocchi per gradino***/
        for(j=0; j<n; j++){
            /***Numero di blocchi su cui poggia il gradino***/
            for(k=y; k>0; k--){

                if(x >= MIN_X && x <= MAX_X && k >= MIN_Y && k <= MAX_Y){
                    generateBlock(x, k, -1, fp);
                    fprintf(fp, ",\n");
                }

            }

            x++;

        }
        /***Gradino completato ---> prossimo gradino***/
        x = x + step_x;
        y = y + step_y;

    }

}

void generateBlock(int x, int y, int id, FILE *fp){

    if(id == -1)
        fprintf(fp, "\t{x:%d,y:%d}", x, y);
    else
        fprintf(fp, "\t{x:%d,y:%d,id:%d}", x, y, id);

}

int numeroCifre(int n){

    int cont = 1;

    while(n/10 != 0){
        cont++;
        n /= 10;
    }

    return cont;

}

int check_char(char c){

    /**
        b: normal block
        g: ground block
        l: lava   block
        0: none
        P: Princess Peach
        M: Mario
        G: Goomba
    **/

    return (c == 'b' || c == 'g' || c == 'l' || c == '0' || c == 'P' || c == 'M' || c == 'G');

}

void generateLevelFromFile(const char *fileName, FILE *fp_out){

    FILE *fp_in = fopen(fileName, "r");
    char carattere, ultimo_carattere, *s;
    int r_tot, c_tot, current_r, current_c;
    int player_x = 0, player_y = 0;
    int blocks_counter = 0;
    int platforms_counter = 0, platform_length = 0, platform_x = 0, platform_y = 0;
    int npcs_counter = 0;

    if(fp_in == NULL){
        fprintf(stdout, "ERRORE: impossibile aprire il file %s in lettura!\n", fileName);
        exit(-1);
    }

    /**
        Il file deve contenere:
        1) Sulla prima riga il numero di righe del livello nel formato "r:n";
        2) Sulla seconda riga il numero di colonne del livello nel formato "c:n";
        3) Sulle altre righe la struttura del livello, seguendo la legenda specificata a inizio programma;
    **/

    fscanf(fp_in, "r:%d\n", &r_tot);
    fscanf(fp_in, "c:%d\n", &c_tot);

    /** Alloco stringa di supporto basandomi sulla massima dimensione della mappa **/
    s = (char*) malloc(sizeof("{x:,y:,vx:,vy:,id:}") + (numeroCifre(r_tot) + numeroCifre(c_tot) + numeroCifre(N_ID) + 2*(numeroCifre(MAX_V)+1) + 1) * sizeof(char));

    /** Alloco la matrice dei blocchi e quella delle piattaforme **/
    blocks    = (char**) malloc(r_tot * c_tot * sizeof(char*));
    platforms = (char**) malloc(r_tot * c_tot * sizeof(char*));
    npcs      = (char**) malloc(r_tot * c_tot * sizeof(char*));

    if(blocks == NULL || platforms == NULL || npcs == NULL){
        fprintf(stdout, "ERRORE: impossibile allocare la matrice di blocchi/piattaforme/npc!\n");
        exit(-1);
    }

    /** LETTURA DEL FILE **/
    current_r = r_tot - 1;
    current_c = 0;
    while(fscanf(fp_in, "%c", &carattere) != EOF){

        if(carattere == '\n'){

            current_r--;
            current_c = 0;

            /** Se l'ultimo carattere letto era 'p' � appena terminata una piattaforma ---> la memorizzo nella matrice **/
            if(ultimo_carattere == 'p'){

                sprintf(s, "{x:%d,y:%d,n:%d}", platform_x, platform_y, platform_length);

                platforms[platforms_counter++] = strdup(s);
                platform_length = 0;

            }
        }

        else{
            /** Il carattere � uno dei possibili blocchi **/
            if(check_char(carattere)){
                switch(carattere){

                    case '0': break;

                    case 'b': sprintf(s, "{x:%d,y:%d}", current_c, current_r);
                              blocks[blocks_counter++] = strdup(s);
                              break;

                    case 'g': sprintf(s, "{x:%d,y:%d,id:%d}", current_c, current_r, GROUND_ID);
                              blocks[blocks_counter++] = strdup(s);
                              break;

                    case 'l': sprintf(s, "{x:%d,y:%d,id:%d}", current_c, current_r, LAVA_ID);
                              blocks[blocks_counter++] = strdup(s);
                              break;

                    case 'M': player_x = current_c;
                              player_y = current_r;
                              break;

                    case 'P': sprintf(s, "{x:%d,y:%d,vx:0,vy:0,id:%d}", current_c, current_r, PEACH_ID);
                              npcs[npcs_counter++] = strdup(s);
                              break;

                    case 'G': sprintf(s, "{x:%d,y:%d,vx:%d,vy:0,id:%d}", current_c, current_r, GOOMBA_VX * (rand()%2 == 1 ? -1:1),GOOMBA_ID);
                              npcs[npcs_counter++] = strdup(s);
                              break;

                    default:  break;

                }

                /** Se l'ultimo carattere letto era 'p' � appena terminata una piattaforma ---> la memorizzo nella matrice **/
                if(ultimo_carattere == 'p'){

                    sprintf(s, "{x:%d,y:%d,n:%d}", platform_x, platform_y, platform_length);

                    platforms[platforms_counter++] = strdup(s);
                    platform_length = 0;

                }

            }
            else if(carattere == 'p'){
                /** Primo blocco della piattaforma ---> salvo le coordinate **/
                if(ultimo_carattere != 'p'){
                    platform_x = current_c;
                    platform_y = current_r;
                }
                /** Blocco intermedio/finale della piattaforma **/
                platform_length++;
            }

            current_c++;

        }

        ultimo_carattere = carattere;

    }

    /** SCRITTURA DEL FILE DI OUTPUT CONTENENTE IL LIVELLO **/

    /** Scrittura del livello **/
    fprintf(fp_out, "const level = {\n\twidth:%d,\n\theight:%d,\n", c_tot, r_tot);

    /** Scrittura del player **/
    fprintf(fp_out, "\tplayer:[\n\t\t{x:%d,y:%d}\n\t],\n", player_x, player_y);

    /** Scrittura dei blocchi **/
    fprintf(fp_out, "\tblock:[\n");
    for(current_r=0; current_r<blocks_counter; current_r++){

        fprintf(fp_out, "\t\t%s", blocks[current_r]);

        if(current_r != blocks_counter - 1)
            fprintf(fp_out, ",\n");

    }
    fprintf(fp_out, "\n\t],\n");

    /** Scrittura delle piattaforme **/
    fprintf(fp_out, "\tplatform:[\n");
    for(current_r=0; current_r<platforms_counter; current_r++){

        fprintf(fp_out, "\t\t%s", platforms[current_r]);

        if(current_r != platforms_counter - 1)
            fprintf(fp_out, ",\n");

    }
    fprintf(fp_out, "\n\t],\n");

    /** Scrittura degli npc **/
    fprintf(fp_out, "\tnpc:[\n");
    for(current_r=0; current_r<npcs_counter; current_r++){

        fprintf(fp_out, "\t\t%s", npcs[current_r]);

        if(current_r != npcs_counter - 1)
            fprintf(fp_out, ",\n");

    }
    fprintf(fp_out, "\n\t]\n");

    fprintf(fp_out, "}");

    /** Free della memoria **/
    for(current_r=0; current_r<blocks_counter; current_r++)
        free(blocks[current_r]);

    for(current_r=0; current_r<platforms_counter; current_r++)
        free(platforms[current_r]);

    for(current_r=0; current_r<npcs_counter; current_r++)
        free(npcs[current_r]);

    free(blocks);
    free(platforms);
    free(npcs);
    free(s);

    fclose(fp_in);

}

int main()
{
    FILE *fp;
    time_t t;
    int n;

    /* Intializes random number generator */
    srand((unsigned) time(&t));

    fp = fopen(FILE_OUT, "w");
    if(fp == NULL){
        fprintf(stdout, "ERRORE: impossibile aprire il file %s in scrittura!\n", FILE_OUT);
        exit(-1);
    }

    /** Genera da 1 a MAX_PLATFORMS piattaforme **/
    n = rand() % MAX_PLATFORMS + 1;

    /** Se vengono generate meno di MIN_PLATFORMS si impone n = MIN_PLATFORMS **/
    if(n < MIN_PLATFORMS)
        n = MIN_PLATFORMS;

    //printRandomPlatforms(n, fp);

    //generatePlatformStairs(1, 1, 1, 2, 2, 10, fp);

    //generateBlockStairs(1, 10, 2, -1, 3, 10, fp);

    generateLevelFromFile(FILE_IN, fp);

    fclose(fp);

    return 0;
}
