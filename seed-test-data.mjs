import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";
import { memorialProfiles, activities, memorialMessages } from "./drizzle/schema.js";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Test profiles data
const testProfiles = [
  {
    name: "Maria Helena Santos",
    birthDate: new Date("1935-05-12"),
    deathDate: new Date("2023-11-15"),
    biography: "Maria Helena foi uma professora dedicada que inspirou gerações de alunos. Amante da literatura e da música clássica, dedicou sua vida à educação e à família. Será sempre lembrada por seu sorriso acolhedor e palavras sábias.",
    creatorId: 1,
    photoPath: "nGjkatOeB0ks.webp"
  },
  {
    name: "João Pedro Oliveira",
    birthDate: new Date("1942-08-20"),
    deathDate: new Date("2024-01-10"),
    biography: "João Pedro foi um engenheiro brilhante e pai exemplar. Apaixonado por tecnologia e inovação, contribuiu para diversos projetos que transformaram a comunidade. Sua gentileza e sabedoria permanecerão em nossos corações.",
    creatorId: 1,
    photoPath: "4xuquflLOMVH.webp"
  },
  {
    name: "Ana Clara Rodrigues",
    birthDate: new Date("1950-03-08"),
    deathDate: new Date("2024-02-28"),
    biography: "Ana Clara dedicou sua vida ao cuidado dos outros como enfermeira. Sua compaixão e dedicação tocaram inúmeras vidas. Amante da jardinagem e da culinária, sempre reunia a família com suas receitas especiais.",
    creatorId: 1,
    photoPath: "XiiHhWiVFu0C.jpg"
  },
  {
    name: "Carlos Alberto Ferreira",
    birthDate: new Date("1938-11-30"),
    deathDate: new Date("2023-09-05"),
    biography: "Carlos Alberto foi um comerciante respeitado e líder comunitário. Conhecido por sua generosidade e senso de justiça, sempre esteve presente para ajudar quem precisava. Sua memória vive através das muitas vidas que tocou.",
    creatorId: 1,
    photoPath: "buTLlfTjv7Kg.jpg"
  }
];

const messages = [
  "Saudades eternas. Você foi uma inspiração para todos nós.",
  "Sua memória viverá para sempre em nossos corações. Descanse em paz.",
  "Nunca esqueceremos seus ensinamentos e seu amor incondicional.",
  "Obrigado por tudo que fez por nossa família. Sentiremos sua falta.",
  "Um exemplo de vida que levaremos conosco para sempre.",
  "Que Deus te receba de braços abertos. Você merece todo o descanso.",
  "Sua bondade e sabedoria nos guiarão sempre. Até nos encontrarmos novamente.",
  "Gratidão por cada momento compartilhado. Você faz muita falta."
];

async function seedTestData() {
  console.log("🌱 Iniciando população do banco de dados com perfis de teste...\n");

  try {
    for (const profile of testProfiles) {
      console.log(`📝 Criando perfil: ${profile.name}`);
      
      // Note: In a real scenario, you would upload the image to S3 first
      // For this seed script, we're using placeholder URLs
      const photoUrl = `https://via.placeholder.com/400x400?text=${encodeURIComponent(profile.name)}`;
      
      const [result] = await db.insert(memorialProfiles).values({
        name: profile.name,
        birthDate: profile.birthDate,
        deathDate: profile.deathDate,
        biography: profile.biography,
        creatorId: profile.creatorId,
        photoUrl: photoUrl,
        photoKey: `test-${profile.photoPath}`,
      });
      
      const memorialId = result.insertId;
      console.log(`✅ Perfil criado com ID: ${memorialId}`);

      // Add activity
      await db.insert(activities).values({
        type: "profile_created",
        memorialId: Number(memorialId),
        userId: profile.creatorId,
      });

      // Add some messages
      const numMessages = Math.floor(Math.random() * 3) + 2; // 2-4 messages
      for (let i = 0; i < numMessages; i++) {
        const message = messages[Math.floor(Math.random() * messages.length)];
        const authorName = `Visitante ${Math.floor(Math.random() * 100)}`;
        
        await db.insert(memorialMessages).values({
          memorialId: Number(memorialId),
          content: message,
          authorName: authorName,
        });

        await db.insert(activities).values({
          type: "message_posted",
          memorialId: Number(memorialId),
        });
      }
      console.log(`💬 Adicionadas ${numMessages} mensagens`);

      // Simulate some visits
      const visits = Math.floor(Math.random() * 50) + 10; // 10-60 visits
      await db.update(memorialProfiles)
        .set({ visitCount: visits })
        .where(eq(memorialProfiles.id, Number(memorialId)));
      console.log(`👁️  Simuladas ${visits} visitas\n`);
    }

    console.log("✨ População do banco de dados concluída com sucesso!");
    console.log(`📊 Total de perfis criados: ${testProfiles.length}`);
    
  } catch (error) {
    console.error("❌ Erro ao popular banco de dados:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

seedTestData();
