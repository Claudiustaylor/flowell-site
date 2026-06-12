import { Music, ExternalLink } from "lucide-react";
import { YoutubeIcon } from "@/components/BrandIcons";

const tracks = [
  { title: "Feel It", plays: "9,719 plays", image: "/images/feel-it.jpg", spotifyUrl: "https://open.spotify.com/track/6t6a3hYQdC5b1p8qXJ4v2k" },
  { title: "Flowell & Friends", plays: "Album · 2023", image: "/images/fashion-legend.jpg", spotifyUrl: "https://open.spotify.com/artist/1Vswo3zB5kwT95O0mQVZH9" },
  { title: "CT (Coffee Table)", plays: "Single", image: "/images/come-over.jpg", spotifyUrl: "https://open.spotify.com/artist/1Vswo3zB5kwT95O0mQVZH9" },
  { title: "For the Love of Teez", plays: "Single · 2021", image: "/images/briii.jpg", spotifyUrl: "https://open.spotify.com/artist/1Vswo3zB5kwT95O0mQVZH9" },
  { title: "Midnight in Lagos", plays: "Single", image: "/images/wicked-af.jpg", spotifyUrl: "https://open.spotify.com/artist/1Vswo3zB5kwT95O0mQVZH9" },
];

export default function MusicPage() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="section-label">Discography</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Music</h1>
        <p className="text-white/50 max-w-lg mx-auto">
          Hip-hop, trap, Afrobeat, and afroswing instrumentals. Produced by Flowell.
        </p>
      </div>

      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <YoutubeIcon className="w-5 h-5 text-flowell-yellow" />
          Latest Video
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-flowell-darker">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/OBqjl66YDZk"
              title="Flowell Latest Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <a
              href="https://www.youtube.com/channel/UCssfFn-X2kzNzrVQP89jGrg"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <YoutubeIcon className="w-4 h-4" />
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Music className="w-5 h-5 text-flowell-yellow" />
          Discography
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <a
              key={track.title}
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-flowell-dark rounded-lg border border-white/10 overflow-hidden card-hover block animate-slide-up"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{track.title}</h3>
                <p className="text-sm text-white/50">{track.plays}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="text-center">
        <a
          href="https://open.spotify.com/artist/1Vswo3zB5kwT95O0mQVZH9"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex"
        >
          <Music className="w-4 h-4" />
          Stream Full Catalog on Spotify
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
