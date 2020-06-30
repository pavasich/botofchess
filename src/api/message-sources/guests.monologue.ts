import Monologue from '../../models/Monologue';

export default function streamGuests() {
    return new Monologue()
        .add('Today we\'re joined by...')
        .add('Dr. Christine Moutier of the AFSP - afsp.org', 100)
        .add('CrevLM - twitch.tv/crevlm', 100)
        .add('Jude - twitch.tv/mermaidqueenjude', 100)
        .add('Paije - twitch.tv/paijemonstre', 100)
        .add('Stephneee - twitch.tv/stephneee_plz', 100);
}
