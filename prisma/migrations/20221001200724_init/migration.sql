-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(22) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "refresh_token" VARCHAR(400),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" VARCHAR(22) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "uri" VARCHAR(250) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" VARCHAR(22) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "uri" VARCHAR(250) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" VARCHAR(22) NOT NULL,
    "id_user" VARCHAR(22) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistTrack" (
    "id_playlist" VARCHAR(22) NOT NULL,
    "id_track" VARCHAR(22) NOT NULL,

    CONSTRAINT "PlaylistTrack_pkey" PRIMARY KEY ("id_playlist","id_track")
);

-- CreateTable
CREATE TABLE "TrackArtist" (
    "id_artist" VARCHAR(22) NOT NULL,
    "id_track" VARCHAR(22) NOT NULL,

    CONSTRAINT "TrackArtist_pkey" PRIMARY KEY ("id_artist","id_track")
);

-- CreateTable
CREATE TABLE "UserTrack" (
    "id_user" VARCHAR(22) NOT NULL,
    "id_track" VARCHAR(22) NOT NULL,
    "first_play" TIMESTAMP(3) NOT NULL,
    "last_play" TIMESTAMP(3) NOT NULL,
    "is_on_playlist" BOOLEAN NOT NULL DEFAULT true,
    "nb_listening_total" INTEGER NOT NULL DEFAULT 1,
    "nb_listening_first_month" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserTrack_pkey" PRIMARY KEY ("id_user","id_track")
);

-- CreateTable
CREATE TABLE "Context" (
    "id" SERIAL NOT NULL,
    "last_fetch" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_month_year_id_user_key" ON "Playlist"("month", "year", "id_user");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_id_playlist_fkey" FOREIGN KEY ("id_playlist") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_id_track_fkey" FOREIGN KEY ("id_track") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackArtist" ADD CONSTRAINT "TrackArtist_id_artist_fkey" FOREIGN KEY ("id_artist") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackArtist" ADD CONSTRAINT "TrackArtist_id_track_fkey" FOREIGN KEY ("id_track") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrack" ADD CONSTRAINT "UserTrack_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrack" ADD CONSTRAINT "UserTrack_id_track_fkey" FOREIGN KEY ("id_track") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
