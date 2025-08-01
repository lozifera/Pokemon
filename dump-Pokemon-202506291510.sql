PGDMP  '    
                }            Pokemon    16.3    16.3 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    194564    Pokemon    DATABASE     ~   CREATE DATABASE "Pokemon" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Bolivia.1252';
    DROP DATABASE "Pokemon";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            u           1247    196455    genero_enum    TYPE     _   CREATE TYPE public.genero_enum AS ENUM (
    'masculino',
    'femenino',
    'desconocido'
);
    DROP TYPE public.genero_enum;
       public          postgres    false    4            �            1259    196471    Articulo    TABLE     �   CREATE TABLE public."Articulo" (
    id_articulo integer NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL
);
    DROP TABLE public."Articulo";
       public         heap    postgres    false    4            �            1259    196470    Articulo_id_articulo_seq    SEQUENCE     �   CREATE SEQUENCE public."Articulo_id_articulo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public."Articulo_id_articulo_seq";
       public          postgres    false    4    228            �           0    0    Articulo_id_articulo_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."Articulo_id_articulo_seq" OWNED BY public."Articulo".id_articulo;
          public          postgres    false    227            �            1259    196505    Cat    TABLE     �   CREATE TABLE public."Cat" (
    id_cat integer NOT NULL,
    nombre character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL
);
    DROP TABLE public."Cat";
       public         heap    postgres    false    4            �            1259    196504    Cat_id_cat_seq    SEQUENCE     �   CREATE SEQUENCE public."Cat_id_cat_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Cat_id_cat_seq";
       public          postgres    false    236    4            �           0    0    Cat_id_cat_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Cat_id_cat_seq" OWNED BY public."Cat".id_cat;
          public          postgres    false    235            �            1259    196462    Detalle    TABLE     "  CREATE TABLE public."Detalle" (
    id_detalle integer NOT NULL,
    nivel integer NOT NULL,
    genero public.genero_enum NOT NULL,
    brillante boolean NOT NULL,
    "Tipo_tera" integer NOT NULL,
    path character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL
);
    DROP TABLE public."Detalle";
       public         heap    postgres    false    4    885            �            1259    196461    Detalle_id_detalle_seq    SEQUENCE     �   CREATE SEQUENCE public."Detalle_id_detalle_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."Detalle_id_detalle_seq";
       public          postgres    false    226    4            �           0    0    Detalle_id_detalle_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."Detalle_id_detalle_seq" OWNED BY public."Detalle".id_detalle;
          public          postgres    false    225            �            1259    196489    Equipo    TABLE     �   CREATE TABLE public."Equipo" (
    id_equipo integer NOT NULL,
    nombre character varying(255) NOT NULL,
    id_usuario integer NOT NULL
);
    DROP TABLE public."Equipo";
       public         heap    postgres    false    4            �            1259    196540    Equipo_Pokemon    TABLE     �  CREATE TABLE public."Equipo_Pokemon" (
    id_equipo_pokemon integer NOT NULL,
    id_equipo integer NOT NULL,
    nombre_pok character varying(255) NOT NULL,
    apodo_pok character varying(255) NOT NULL,
    img_pok character varying(255) NOT NULL,
    id_pokemon integer NOT NULL,
    id_detalle integer NOT NULL,
    id_articulo integer NOT NULL,
    id_estadisticas integer NOT NULL,
    id_habilidad integer NOT NULL
);
 $   DROP TABLE public."Equipo_Pokemon";
       public         heap    postgres    false    4            �            1259    196539 $   Equipo_Pokemon_id_equipo_pokemon_seq    SEQUENCE     �   CREATE SEQUENCE public."Equipo_Pokemon_id_equipo_pokemon_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public."Equipo_Pokemon_id_equipo_pokemon_seq";
       public          postgres    false    243    4            �           0    0 $   Equipo_Pokemon_id_equipo_pokemon_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public."Equipo_Pokemon_id_equipo_pokemon_seq" OWNED BY public."Equipo_Pokemon".id_equipo_pokemon;
          public          postgres    false    242            �            1259    196488    Equipo_id_equipo_seq    SEQUENCE     �   CREATE SEQUENCE public."Equipo_id_equipo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."Equipo_id_equipo_seq";
       public          postgres    false    232    4            �           0    0    Equipo_id_equipo_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."Equipo_id_equipo_seq" OWNED BY public."Equipo".id_equipo;
          public          postgres    false    231            �            1259    196434    Estadisticas    TABLE     b  CREATE TABLE public."Estadisticas" (
    id_estadisticas integer NOT NULL,
    "HP" integer NOT NULL,
    ataque integer NOT NULL,
    defensa integer NOT NULL,
    sp_ataque integer NOT NULL,
    sp_defensa integer NOT NULL,
    velocidad integer NOT NULL,
    id_evs integer NOT NULL,
    id_ivs integer NOT NULL,
    id_naturaleza integer NOT NULL
);
 "   DROP TABLE public."Estadisticas";
       public         heap    postgres    false    4            �            1259    196433     Estadisticas_id_estadisticas_seq    SEQUENCE     �   CREATE SEQUENCE public."Estadisticas_id_estadisticas_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public."Estadisticas_id_estadisticas_seq";
       public          postgres    false    220    4            �           0    0     Estadisticas_id_estadisticas_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public."Estadisticas_id_estadisticas_seq" OWNED BY public."Estadisticas".id_estadisticas;
          public          postgres    false    219            �            1259    196441    Evs    TABLE     �   CREATE TABLE public."Evs" (
    id_evs integer NOT NULL,
    "HP" integer NOT NULL,
    ataque integer NOT NULL,
    defensa integer NOT NULL,
    sp_ataque integer NOT NULL,
    sp_defensa integer NOT NULL,
    velocidad integer NOT NULL
);
    DROP TABLE public."Evs";
       public         heap    postgres    false    4            �            1259    196440    Evs_id_evs_seq    SEQUENCE     �   CREATE SEQUENCE public."Evs_id_evs_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Evs_id_evs_seq";
       public          postgres    false    222    4            �           0    0    Evs_id_evs_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Evs_id_evs_seq" OWNED BY public."Evs".id_evs;
          public          postgres    false    221            �            1259    196523 	   Habilidad    TABLE     �   CREATE TABLE public."Habilidad" (
    id_habilidad integer NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion character varying(255) NOT NULL
);
    DROP TABLE public."Habilidad";
       public         heap    postgres    false    4            �            1259    196522    Habilidad_id_habilidad_seq    SEQUENCE     �   CREATE SEQUENCE public."Habilidad_id_habilidad_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public."Habilidad_id_habilidad_seq";
       public          postgres    false    4    240            �           0    0    Habilidad_id_habilidad_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public."Habilidad_id_habilidad_seq" OWNED BY public."Habilidad".id_habilidad;
          public          postgres    false    239            �            1259    196448    Ivs    TABLE     �   CREATE TABLE public."Ivs" (
    id_ivs integer NOT NULL,
    "HP" integer NOT NULL,
    ataque integer NOT NULL,
    defensa integer NOT NULL,
    sp_ataque integer NOT NULL,
    sp_defensa integer NOT NULL,
    velocidad integer NOT NULL
);
    DROP TABLE public."Ivs";
       public         heap    postgres    false    4            �            1259    196447    Ivs_id_ivs_seq    SEQUENCE     �   CREATE SEQUENCE public."Ivs_id_ivs_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Ivs_id_ivs_seq";
       public          postgres    false    224    4            �           0    0    Ivs_id_ivs_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Ivs_id_ivs_seq" OWNED BY public."Ivs".id_ivs;
          public          postgres    false    223            �            1259    196480 
   Movimiento    TABLE     4  CREATE TABLE public."Movimiento" (
    id_movimiento integer NOT NULL,
    nombre character varying(255) NOT NULL,
    id_tipo integer NOT NULL,
    id_cat integer NOT NULL,
    poder integer NOT NULL,
    "ACC" integer NOT NULL,
    "PP" integer NOT NULL,
    descripcion character varying(255) NOT NULL
);
     DROP TABLE public."Movimiento";
       public         heap    postgres    false    4            �            1259    196479    Movimiento_id_movimiento_seq    SEQUENCE     �   CREATE SEQUENCE public."Movimiento_id_movimiento_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public."Movimiento_id_movimiento_seq";
       public          postgres    false    230    4            �           0    0    Movimiento_id_movimiento_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public."Movimiento_id_movimiento_seq" OWNED BY public."Movimiento".id_movimiento;
          public          postgres    false    229            �            1259    196514 
   Naturaleza    TABLE     �   CREATE TABLE public."Naturaleza" (
    id_naturaleza integer NOT NULL,
    nombre character varying(255) NOT NULL,
    sube_stat character varying(255) NOT NULL,
    baja_stat character varying(255) NOT NULL
);
     DROP TABLE public."Naturaleza";
       public         heap    postgres    false    4            �            1259    196513    Naturaleza_id_naturaleza_seq    SEQUENCE     �   CREATE SEQUENCE public."Naturaleza_id_naturaleza_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public."Naturaleza_id_naturaleza_seq";
       public          postgres    false    238    4            �           0    0    Naturaleza_id_naturaleza_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public."Naturaleza_id_naturaleza_seq" OWNED BY public."Naturaleza".id_naturaleza;
          public          postgres    false    237            �            1259    196425    Pokemon    TABLE     �  CREATE TABLE public."Pokemon" (
    id_pokemon integer NOT NULL,
    nombre_pok character varying(255) NOT NULL,
    "HP" integer NOT NULL,
    ataque integer NOT NULL,
    defensa integer NOT NULL,
    sp_ataque integer NOT NULL,
    sp_defensa integer NOT NULL,
    velocidad integer NOT NULL,
    path character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL
);
    DROP TABLE public."Pokemon";
       public         heap    postgres    false    4            �            1259    196531    Pokemon_Habilidad    TABLE     �   CREATE TABLE public."Pokemon_Habilidad" (
    id_pokemon integer NOT NULL,
    id_habilidad integer NOT NULL,
    tipo text NOT NULL,
    CONSTRAINT "Pokemon_Habilidad_tipo_check" CHECK ((tipo = ANY (ARRAY['oculta'::text, 'normal'::text])))
);
 '   DROP TABLE public."Pokemon_Habilidad";
       public         heap    postgres    false    4            �            1259    196554    Pokemon_Tipo    TABLE     f   CREATE TABLE public."Pokemon_Tipo" (
    id_pokemon integer NOT NULL,
    id_tipo integer NOT NULL
);
 "   DROP TABLE public."Pokemon_Tipo";
       public         heap    postgres    false    4            �            1259    196424    Pokemon_id_pokemon_seq    SEQUENCE     �   CREATE SEQUENCE public."Pokemon_id_pokemon_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."Pokemon_id_pokemon_seq";
       public          postgres    false    218    4            �           0    0    Pokemon_id_pokemon_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."Pokemon_id_pokemon_seq" OWNED BY public."Pokemon".id_pokemon;
          public          postgres    false    217            �            1259    196496    Tipo    TABLE     �   CREATE TABLE public."Tipo" (
    id_tipo integer NOT NULL,
    nombre character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL
);
    DROP TABLE public."Tipo";
       public         heap    postgres    false    4            �            1259    196495    Tipo_id_tipo_seq    SEQUENCE     �   CREATE SEQUENCE public."Tipo_id_tipo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Tipo_id_tipo_seq";
       public          postgres    false    4    234            �           0    0    Tipo_id_tipo_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Tipo_id_tipo_seq" OWNED BY public."Tipo".id_tipo;
          public          postgres    false    233            �            1259    196415    Usuario    TABLE     &  CREATE TABLE public."Usuario" (
    id_usuario integer NOT NULL,
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    correo character varying(255) NOT NULL,
    "contraseña" character varying(255) NOT NULL,
    admin boolean DEFAULT false NOT NULL
);
    DROP TABLE public."Usuario";
       public         heap    postgres    false    4            �            1259    196414    Usuario_id_usuario_seq    SEQUENCE     �   CREATE SEQUENCE public."Usuario_id_usuario_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."Usuario_id_usuario_seq";
       public          postgres    false    216    4            �           0    0    Usuario_id_usuario_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."Usuario_id_usuario_seq" OWNED BY public."Usuario".id_usuario;
          public          postgres    false    215            �            1259    196548    pok_mov    TABLE     �   CREATE TABLE public.pok_mov (
    id_equipo_pokemon integer NOT NULL,
    id_movimiento integer NOT NULL,
    slot integer NOT NULL,
    CONSTRAINT pok_mov_slot_check CHECK ((slot = ANY (ARRAY[1, 2, 3, 4])))
);
    DROP TABLE public.pok_mov;
       public         heap    postgres    false    4            �           2604    196474    Articulo id_articulo    DEFAULT     �   ALTER TABLE ONLY public."Articulo" ALTER COLUMN id_articulo SET DEFAULT nextval('public."Articulo_id_articulo_seq"'::regclass);
 E   ALTER TABLE public."Articulo" ALTER COLUMN id_articulo DROP DEFAULT;
       public          postgres    false    227    228    228            �           2604    196508 
   Cat id_cat    DEFAULT     l   ALTER TABLE ONLY public."Cat" ALTER COLUMN id_cat SET DEFAULT nextval('public."Cat_id_cat_seq"'::regclass);
 ;   ALTER TABLE public."Cat" ALTER COLUMN id_cat DROP DEFAULT;
       public          postgres    false    236    235    236            �           2604    196465    Detalle id_detalle    DEFAULT     |   ALTER TABLE ONLY public."Detalle" ALTER COLUMN id_detalle SET DEFAULT nextval('public."Detalle_id_detalle_seq"'::regclass);
 C   ALTER TABLE public."Detalle" ALTER COLUMN id_detalle DROP DEFAULT;
       public          postgres    false    225    226    226            �           2604    196492    Equipo id_equipo    DEFAULT     x   ALTER TABLE ONLY public."Equipo" ALTER COLUMN id_equipo SET DEFAULT nextval('public."Equipo_id_equipo_seq"'::regclass);
 A   ALTER TABLE public."Equipo" ALTER COLUMN id_equipo DROP DEFAULT;
       public          postgres    false    231    232    232            �           2604    196543     Equipo_Pokemon id_equipo_pokemon    DEFAULT     �   ALTER TABLE ONLY public."Equipo_Pokemon" ALTER COLUMN id_equipo_pokemon SET DEFAULT nextval('public."Equipo_Pokemon_id_equipo_pokemon_seq"'::regclass);
 Q   ALTER TABLE public."Equipo_Pokemon" ALTER COLUMN id_equipo_pokemon DROP DEFAULT;
       public          postgres    false    243    242    243            �           2604    196437    Estadisticas id_estadisticas    DEFAULT     �   ALTER TABLE ONLY public."Estadisticas" ALTER COLUMN id_estadisticas SET DEFAULT nextval('public."Estadisticas_id_estadisticas_seq"'::regclass);
 M   ALTER TABLE public."Estadisticas" ALTER COLUMN id_estadisticas DROP DEFAULT;
       public          postgres    false    220    219    220            �           2604    196444 
   Evs id_evs    DEFAULT     l   ALTER TABLE ONLY public."Evs" ALTER COLUMN id_evs SET DEFAULT nextval('public."Evs_id_evs_seq"'::regclass);
 ;   ALTER TABLE public."Evs" ALTER COLUMN id_evs DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    196526    Habilidad id_habilidad    DEFAULT     �   ALTER TABLE ONLY public."Habilidad" ALTER COLUMN id_habilidad SET DEFAULT nextval('public."Habilidad_id_habilidad_seq"'::regclass);
 G   ALTER TABLE public."Habilidad" ALTER COLUMN id_habilidad DROP DEFAULT;
       public          postgres    false    240    239    240            �           2604    196451 
   Ivs id_ivs    DEFAULT     l   ALTER TABLE ONLY public."Ivs" ALTER COLUMN id_ivs SET DEFAULT nextval('public."Ivs_id_ivs_seq"'::regclass);
 ;   ALTER TABLE public."Ivs" ALTER COLUMN id_ivs DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    196483    Movimiento id_movimiento    DEFAULT     �   ALTER TABLE ONLY public."Movimiento" ALTER COLUMN id_movimiento SET DEFAULT nextval('public."Movimiento_id_movimiento_seq"'::regclass);
 I   ALTER TABLE public."Movimiento" ALTER COLUMN id_movimiento DROP DEFAULT;
       public          postgres    false    230    229    230            �           2604    196517    Naturaleza id_naturaleza    DEFAULT     �   ALTER TABLE ONLY public."Naturaleza" ALTER COLUMN id_naturaleza SET DEFAULT nextval('public."Naturaleza_id_naturaleza_seq"'::regclass);
 I   ALTER TABLE public."Naturaleza" ALTER COLUMN id_naturaleza DROP DEFAULT;
       public          postgres    false    238    237    238            �           2604    196428    Pokemon id_pokemon    DEFAULT     |   ALTER TABLE ONLY public."Pokemon" ALTER COLUMN id_pokemon SET DEFAULT nextval('public."Pokemon_id_pokemon_seq"'::regclass);
 C   ALTER TABLE public."Pokemon" ALTER COLUMN id_pokemon DROP DEFAULT;
       public          postgres    false    217    218    218            �           2604    196499    Tipo id_tipo    DEFAULT     p   ALTER TABLE ONLY public."Tipo" ALTER COLUMN id_tipo SET DEFAULT nextval('public."Tipo_id_tipo_seq"'::regclass);
 =   ALTER TABLE public."Tipo" ALTER COLUMN id_tipo DROP DEFAULT;
       public          postgres    false    233    234    234            �           2604    196418    Usuario id_usuario    DEFAULT     |   ALTER TABLE ONLY public."Usuario" ALTER COLUMN id_usuario SET DEFAULT nextval('public."Usuario_id_usuario_seq"'::regclass);
 C   ALTER TABLE public."Usuario" ALTER COLUMN id_usuario DROP DEFAULT;
       public          postgres    false    215    216    216            �          0    196471    Articulo 
   TABLE DATA           W   COPY public."Articulo" (id_articulo, nombre, descripcion, path, file_name) FROM stdin;
    public          postgres    false    228   ��       �          0    196505    Cat 
   TABLE DATA           @   COPY public."Cat" (id_cat, nombre, path, file_name) FROM stdin;
    public          postgres    false    236   ݨ       �          0    196462    Detalle 
   TABLE DATA           g   COPY public."Detalle" (id_detalle, nivel, genero, brillante, "Tipo_tera", path, file_name) FROM stdin;
    public          postgres    false    226   ��       �          0    196489    Equipo 
   TABLE DATA           A   COPY public."Equipo" (id_equipo, nombre, id_usuario) FROM stdin;
    public          postgres    false    232   �       �          0    196540    Equipo_Pokemon 
   TABLE DATA           �   COPY public."Equipo_Pokemon" (id_equipo_pokemon, id_equipo, nombre_pok, apodo_pok, img_pok, id_pokemon, id_detalle, id_articulo, id_estadisticas, id_habilidad) FROM stdin;
    public          postgres    false    243   4�       z          0    196434    Estadisticas 
   TABLE DATA           �   COPY public."Estadisticas" (id_estadisticas, "HP", ataque, defensa, sp_ataque, sp_defensa, velocidad, id_evs, id_ivs, id_naturaleza) FROM stdin;
    public          postgres    false    220   Q�       |          0    196441    Evs 
   TABLE DATA           `   COPY public."Evs" (id_evs, "HP", ataque, defensa, sp_ataque, sp_defensa, velocidad) FROM stdin;
    public          postgres    false    222   n�       �          0    196523 	   Habilidad 
   TABLE DATA           H   COPY public."Habilidad" (id_habilidad, nombre, descripcion) FROM stdin;
    public          postgres    false    240   ��       ~          0    196448    Ivs 
   TABLE DATA           `   COPY public."Ivs" (id_ivs, "HP", ataque, defensa, sp_ataque, sp_defensa, velocidad) FROM stdin;
    public          postgres    false    224   ��       �          0    196480 
   Movimiento 
   TABLE DATA           o   COPY public."Movimiento" (id_movimiento, nombre, id_tipo, id_cat, poder, "ACC", "PP", descripcion) FROM stdin;
    public          postgres    false    230   ũ       �          0    196514 
   Naturaleza 
   TABLE DATA           S   COPY public."Naturaleza" (id_naturaleza, nombre, sube_stat, baja_stat) FROM stdin;
    public          postgres    false    238   �       x          0    196425    Pokemon 
   TABLE DATA           �   COPY public."Pokemon" (id_pokemon, nombre_pok, "HP", ataque, defensa, sp_ataque, sp_defensa, velocidad, path, file_name) FROM stdin;
    public          postgres    false    218   ��       �          0    196531    Pokemon_Habilidad 
   TABLE DATA           M   COPY public."Pokemon_Habilidad" (id_pokemon, id_habilidad, tipo) FROM stdin;
    public          postgres    false    241   �       �          0    196554    Pokemon_Tipo 
   TABLE DATA           =   COPY public."Pokemon_Tipo" (id_pokemon, id_tipo) FROM stdin;
    public          postgres    false    245   9�       �          0    196496    Tipo 
   TABLE DATA           B   COPY public."Tipo" (id_tipo, nombre, path, file_name) FROM stdin;
    public          postgres    false    234   V�       v          0    196415    Usuario 
   TABLE DATA           _   COPY public."Usuario" (id_usuario, nombre, apellido, correo, "contraseña", admin) FROM stdin;
    public          postgres    false    216   s�       �          0    196548    pok_mov 
   TABLE DATA           I   COPY public.pok_mov (id_equipo_pokemon, id_movimiento, slot) FROM stdin;
    public          postgres    false    244   ��       �           0    0    Articulo_id_articulo_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."Articulo_id_articulo_seq"', 1, false);
          public          postgres    false    227            �           0    0    Cat_id_cat_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Cat_id_cat_seq"', 1, false);
          public          postgres    false    235            �           0    0    Detalle_id_detalle_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Detalle_id_detalle_seq"', 1, false);
          public          postgres    false    225            �           0    0 $   Equipo_Pokemon_id_equipo_pokemon_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public."Equipo_Pokemon_id_equipo_pokemon_seq"', 1, false);
          public          postgres    false    242            �           0    0    Equipo_id_equipo_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Equipo_id_equipo_seq"', 1, false);
          public          postgres    false    231            �           0    0     Estadisticas_id_estadisticas_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public."Estadisticas_id_estadisticas_seq"', 1, false);
          public          postgres    false    219            �           0    0    Evs_id_evs_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Evs_id_evs_seq"', 1, false);
          public          postgres    false    221            �           0    0    Habilidad_id_habilidad_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public."Habilidad_id_habilidad_seq"', 1, false);
          public          postgres    false    239            �           0    0    Ivs_id_ivs_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Ivs_id_ivs_seq"', 1, false);
          public          postgres    false    223            �           0    0    Movimiento_id_movimiento_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public."Movimiento_id_movimiento_seq"', 1, false);
          public          postgres    false    229            �           0    0    Naturaleza_id_naturaleza_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public."Naturaleza_id_naturaleza_seq"', 1, false);
          public          postgres    false    237            �           0    0    Pokemon_id_pokemon_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Pokemon_id_pokemon_seq"', 1, false);
          public          postgres    false    217            �           0    0    Tipo_id_tipo_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Tipo_id_tipo_seq"', 1, false);
          public          postgres    false    233            �           0    0    Usuario_id_usuario_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Usuario_id_usuario_seq"', 1, false);
          public          postgres    false    215            �           2606    196478    Articulo Articulo_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public."Articulo"
    ADD CONSTRAINT "Articulo_pkey" PRIMARY KEY (id_articulo);
 D   ALTER TABLE ONLY public."Articulo" DROP CONSTRAINT "Articulo_pkey";
       public            postgres    false    228            �           2606    196512    Cat Cat_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Cat"
    ADD CONSTRAINT "Cat_pkey" PRIMARY KEY (id_cat);
 :   ALTER TABLE ONLY public."Cat" DROP CONSTRAINT "Cat_pkey";
       public            postgres    false    236            �           2606    196469    Detalle Detalle_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Detalle"
    ADD CONSTRAINT "Detalle_pkey" PRIMARY KEY (id_detalle);
 B   ALTER TABLE ONLY public."Detalle" DROP CONSTRAINT "Detalle_pkey";
       public            postgres    false    226            �           2606    196547 "   Equipo_Pokemon Equipo_Pokemon_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY public."Equipo_Pokemon"
    ADD CONSTRAINT "Equipo_Pokemon_pkey" PRIMARY KEY (id_equipo_pokemon);
 P   ALTER TABLE ONLY public."Equipo_Pokemon" DROP CONSTRAINT "Equipo_Pokemon_pkey";
       public            postgres    false    243            �           2606    196494    Equipo Equipo_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public."Equipo"
    ADD CONSTRAINT "Equipo_pkey" PRIMARY KEY (id_equipo);
 @   ALTER TABLE ONLY public."Equipo" DROP CONSTRAINT "Equipo_pkey";
       public            postgres    false    232            �           2606    196439    Estadisticas Estadisticas_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public."Estadisticas"
    ADD CONSTRAINT "Estadisticas_pkey" PRIMARY KEY (id_estadisticas);
 L   ALTER TABLE ONLY public."Estadisticas" DROP CONSTRAINT "Estadisticas_pkey";
       public            postgres    false    220            �           2606    196446    Evs Evs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Evs"
    ADD CONSTRAINT "Evs_pkey" PRIMARY KEY (id_evs);
 :   ALTER TABLE ONLY public."Evs" DROP CONSTRAINT "Evs_pkey";
       public            postgres    false    222            �           2606    196530    Habilidad Habilidad_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."Habilidad"
    ADD CONSTRAINT "Habilidad_pkey" PRIMARY KEY (id_habilidad);
 F   ALTER TABLE ONLY public."Habilidad" DROP CONSTRAINT "Habilidad_pkey";
       public            postgres    false    240            �           2606    196453    Ivs Ivs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Ivs"
    ADD CONSTRAINT "Ivs_pkey" PRIMARY KEY (id_ivs);
 :   ALTER TABLE ONLY public."Ivs" DROP CONSTRAINT "Ivs_pkey";
       public            postgres    false    224            �           2606    196487    Movimiento Movimiento_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public."Movimiento"
    ADD CONSTRAINT "Movimiento_pkey" PRIMARY KEY (id_movimiento);
 H   ALTER TABLE ONLY public."Movimiento" DROP CONSTRAINT "Movimiento_pkey";
       public            postgres    false    230            �           2606    196521    Naturaleza Naturaleza_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public."Naturaleza"
    ADD CONSTRAINT "Naturaleza_pkey" PRIMARY KEY (id_naturaleza);
 H   ALTER TABLE ONLY public."Naturaleza" DROP CONSTRAINT "Naturaleza_pkey";
       public            postgres    false    238            �           2606    196538 (   Pokemon_Habilidad Pokemon_Habilidad_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."Pokemon_Habilidad"
    ADD CONSTRAINT "Pokemon_Habilidad_pkey" PRIMARY KEY (id_pokemon, id_habilidad);
 V   ALTER TABLE ONLY public."Pokemon_Habilidad" DROP CONSTRAINT "Pokemon_Habilidad_pkey";
       public            postgres    false    241    241            �           2606    196558    Pokemon_Tipo Pokemon_Tipo_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public."Pokemon_Tipo"
    ADD CONSTRAINT "Pokemon_Tipo_pkey" PRIMARY KEY (id_pokemon, id_tipo);
 L   ALTER TABLE ONLY public."Pokemon_Tipo" DROP CONSTRAINT "Pokemon_Tipo_pkey";
       public            postgres    false    245    245            �           2606    196432    Pokemon Pokemon_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Pokemon"
    ADD CONSTRAINT "Pokemon_pkey" PRIMARY KEY (id_pokemon);
 B   ALTER TABLE ONLY public."Pokemon" DROP CONSTRAINT "Pokemon_pkey";
       public            postgres    false    218            �           2606    196503    Tipo Tipo_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public."Tipo"
    ADD CONSTRAINT "Tipo_pkey" PRIMARY KEY (id_tipo);
 <   ALTER TABLE ONLY public."Tipo" DROP CONSTRAINT "Tipo_pkey";
       public            postgres    false    234            �           2606    196423    Usuario Usuario_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id_usuario);
 B   ALTER TABLE ONLY public."Usuario" DROP CONSTRAINT "Usuario_pkey";
       public            postgres    false    216            �           2606    196553    pok_mov pok_mov_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.pok_mov
    ADD CONSTRAINT pok_mov_pkey PRIMARY KEY (id_equipo_pokemon, id_movimiento);
 >   ALTER TABLE ONLY public.pok_mov DROP CONSTRAINT pok_mov_pkey;
       public            postgres    false    244    244            �           2606    196639 !   Detalle detalle_tipo_tera_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Detalle"
    ADD CONSTRAINT detalle_tipo_tera_foreign FOREIGN KEY ("Tipo_tera") REFERENCES public."Tipo"(id_tipo);
 M   ALTER TABLE ONLY public."Detalle" DROP CONSTRAINT detalle_tipo_tera_foreign;
       public          postgres    false    226    4804    234            �           2606    196569     Equipo equipo_id_usuario_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Equipo"
    ADD CONSTRAINT equipo_id_usuario_foreign FOREIGN KEY (id_usuario) REFERENCES public."Usuario"(id_usuario);
 L   ALTER TABLE ONLY public."Equipo" DROP CONSTRAINT equipo_id_usuario_foreign;
       public          postgres    false    232    4786    216            �           2606    196564 1   Equipo_Pokemon equipo_pokemon_id_articulo_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Equipo_Pokemon"
    ADD CONSTRAINT equipo_pokemon_id_articulo_foreign FOREIGN KEY (id_articulo) REFERENCES public."Articulo"(id_articulo);
 ]   ALTER TABLE ONLY public."Equipo_Pokemon" DROP CONSTRAINT equipo_pokemon_id_articulo_foreign;
       public          postgres    false    243    4798    228            �           2606    196624 0   Equipo_Pokemon equipo_pokemon_id_detalle_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Equipo_Pokemon"
    ADD CONSTRAINT equipo_pokemon_id_detalle_foreign FOREIGN KEY (id_detalle) REFERENCES public."Detalle"(id_detalle);
 \   ALTER TABLE ONLY public."Equipo_Pokemon" DROP CONSTRAINT equipo_pokemon_id_detalle_foreign;
       public          postgres    false    243    226    4796            �           2606    196619 /   Equipo_Pokemon equipo_pokemon_id_equipo_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Equipo_Pokemon"
    ADD CONSTRAINT equipo_pokemon_id_equipo_foreign FOREIGN KEY (id_equipo) REFERENCES public."Equipo"(id_equipo);
 [   ALTER TABLE ONLY public."Equipo_Pokemon" DROP CONSTRAINT equipo_pokemon_id_equipo_foreign;
       public          postgres    false    4802    243    232            �           2606    196599 5   Equipo_Pokemon equipo_pokemon_id_estadisticas_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Equipo_Pokemon"
    ADD CONSTRAINT equipo_pokemon_id_estadisticas_foreign FOREIGN KEY (id_estadisticas) REFERENCES public."Estadisticas"(id_estadisticas);
 a   ALTER TABLE ONLY public."Equipo_Pokemon" DROP CONSTRAINT equipo_pokemon_id_estadisticas_foreign;
       public          postgres    false    4790    243    220            �           2606    196629 2   Equipo_Pokemon equipo_pokemon_id_habilidad_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Equipo_Pokemon"
    ADD CONSTRAINT equipo_pokemon_id_habilidad_foreign FOREIGN KEY (id_habilidad) REFERENCES public."Habilidad"(id_habilidad);
 ^   ALTER TABLE ONLY public."Equipo_Pokemon" DROP CONSTRAINT equipo_pokemon_id_habilidad_foreign;
       public          postgres    false    243    240    4810            �           2606    196609 0   Equipo_Pokemon equipo_pokemon_id_pokemon_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Equipo_Pokemon"
    ADD CONSTRAINT equipo_pokemon_id_pokemon_foreign FOREIGN KEY (id_pokemon) REFERENCES public."Pokemon"(id_pokemon);
 \   ALTER TABLE ONLY public."Equipo_Pokemon" DROP CONSTRAINT equipo_pokemon_id_pokemon_foreign;
       public          postgres    false    4788    218    243            �           2606    196594 (   Estadisticas estadisticas_id_evs_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Estadisticas"
    ADD CONSTRAINT estadisticas_id_evs_foreign FOREIGN KEY (id_evs) REFERENCES public."Evs"(id_evs);
 T   ALTER TABLE ONLY public."Estadisticas" DROP CONSTRAINT estadisticas_id_evs_foreign;
       public          postgres    false    222    220    4792            �           2606    196559 (   Estadisticas estadisticas_id_ivs_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Estadisticas"
    ADD CONSTRAINT estadisticas_id_ivs_foreign FOREIGN KEY (id_ivs) REFERENCES public."Ivs"(id_ivs);
 T   ALTER TABLE ONLY public."Estadisticas" DROP CONSTRAINT estadisticas_id_ivs_foreign;
       public          postgres    false    224    220    4794            �           2606    196589 /   Estadisticas estadisticas_id_naturaleza_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Estadisticas"
    ADD CONSTRAINT estadisticas_id_naturaleza_foreign FOREIGN KEY (id_naturaleza) REFERENCES public."Naturaleza"(id_naturaleza);
 [   ALTER TABLE ONLY public."Estadisticas" DROP CONSTRAINT estadisticas_id_naturaleza_foreign;
       public          postgres    false    4808    238    220            �           2606    196604 $   Movimiento movimiento_id_cat_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Movimiento"
    ADD CONSTRAINT movimiento_id_cat_foreign FOREIGN KEY (id_cat) REFERENCES public."Cat"(id_cat);
 P   ALTER TABLE ONLY public."Movimiento" DROP CONSTRAINT movimiento_id_cat_foreign;
       public          postgres    false    230    236    4806            �           2606    196614 %   Movimiento movimiento_id_tipo_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Movimiento"
    ADD CONSTRAINT movimiento_id_tipo_foreign FOREIGN KEY (id_tipo) REFERENCES public."Tipo"(id_tipo);
 Q   ALTER TABLE ONLY public."Movimiento" DROP CONSTRAINT movimiento_id_tipo_foreign;
       public          postgres    false    234    4804    230            �           2606    196579 )   pok_mov pok_mov_id_equipo_pokemon_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.pok_mov
    ADD CONSTRAINT pok_mov_id_equipo_pokemon_foreign FOREIGN KEY (id_equipo_pokemon) REFERENCES public."Equipo_Pokemon"(id_equipo_pokemon);
 S   ALTER TABLE ONLY public.pok_mov DROP CONSTRAINT pok_mov_id_equipo_pokemon_foreign;
       public          postgres    false    244    243    4814            �           2606    196584 %   pok_mov pok_mov_id_movimiento_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.pok_mov
    ADD CONSTRAINT pok_mov_id_movimiento_foreign FOREIGN KEY (id_movimiento) REFERENCES public."Movimiento"(id_movimiento);
 O   ALTER TABLE ONLY public.pok_mov DROP CONSTRAINT pok_mov_id_movimiento_foreign;
       public          postgres    false    244    230    4800            �           2606    196649 8   Pokemon_Habilidad pokemon_habilidad_id_habilidad_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pokemon_Habilidad"
    ADD CONSTRAINT pokemon_habilidad_id_habilidad_foreign FOREIGN KEY (id_habilidad) REFERENCES public."Habilidad"(id_habilidad);
 d   ALTER TABLE ONLY public."Pokemon_Habilidad" DROP CONSTRAINT pokemon_habilidad_id_habilidad_foreign;
       public          postgres    false    4810    241    240            �           2606    196644 6   Pokemon_Habilidad pokemon_habilidad_id_pokemon_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pokemon_Habilidad"
    ADD CONSTRAINT pokemon_habilidad_id_pokemon_foreign FOREIGN KEY (id_pokemon) REFERENCES public."Pokemon"(id_pokemon);
 b   ALTER TABLE ONLY public."Pokemon_Habilidad" DROP CONSTRAINT pokemon_habilidad_id_pokemon_foreign;
       public          postgres    false    241    4788    218            �           2606    196574 ,   Pokemon_Tipo pokemon_tipo_id_pokemon_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pokemon_Tipo"
    ADD CONSTRAINT pokemon_tipo_id_pokemon_foreign FOREIGN KEY (id_pokemon) REFERENCES public."Pokemon"(id_pokemon);
 X   ALTER TABLE ONLY public."Pokemon_Tipo" DROP CONSTRAINT pokemon_tipo_id_pokemon_foreign;
       public          postgres    false    245    4788    218            �           2606    196634 )   Pokemon_Tipo pokemon_tipo_id_tipo_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pokemon_Tipo"
    ADD CONSTRAINT pokemon_tipo_id_tipo_foreign FOREIGN KEY (id_tipo) REFERENCES public."Tipo"(id_tipo);
 U   ALTER TABLE ONLY public."Pokemon_Tipo" DROP CONSTRAINT pokemon_tipo_id_tipo_foreign;
       public          postgres    false    245    4804    234            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      z      x������ � �      |      x������ � �      �      x������ � �      ~      x������ � �      �      x������ � �      �      x������ � �      x      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      v      x������ � �      �      x������ � �     