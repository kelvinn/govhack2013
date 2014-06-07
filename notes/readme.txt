
# First step is to create the table. The format is 
# columnname type otherstuff
# type is from here: http://www.postgresql.org/docs/9.2/static/datatype.html
# basically, if it is short and known, it is "character varying(NN)" where NN is length
# if it is long, then just put text
# put integer if it is always a number
# it is a good idea to rename the headers in the CSV file to match the column names

CREATE TABLE govhack_2013.centrelink
(
  gid serial NOT NULL,
  name character varying(50),
  code character varying(10),
  office_type character varying(50),
  type_code character varying(5),
  shop_level character varying(50),
  building character varying(75),
  street_address text,
  city character varying(30),
  state character varying(10),
  postcode integer,
  postal_address text,
  open_hours text,
  latitude character varying(50),
  longitude character varying(50),
  geom geometry,
  CONSTRAINT centrelink_pkey PRIMARY KEY (gid),
  CONSTRAINT enforce_dims_geom CHECK (st_ndims(geom) = 2),
  CONSTRAINT enforce_geotype_geom CHECK (geometrytype(geom) = 'POINT'::text OR geom IS NULL),
  CONSTRAINT enforce_srid_geom CHECK (st_srid(geom) = 4326)
);

# We then enter this line to import all the data
\copy govhack_2013.centrelink(name,code,office_type,type_code,shop_level,building,street_address,city,state,postcode,postal_address,open_hours,longitude,latitude) FROM '/home/kelvinn/centrelink.csv' DELIMITERS ',' CSV HEADER;

# We finally can transorm text-based geo data (e.g. lat/lng) to a useful spatial format.
UPDATE govhack_2013.centrelink
SET geom = ST_GeomFromText('POINT(' || longitude || ' ' || latitude || ')',4326);