import Monologue from '../../models/Monologue';

export default function support() {
    return new Monologue()
        .add('Send a Pride card to someone you love and show your support! https://bit.ly/AFSPcards', 100)
        .add('Learn more about supporting LGBTQIA+ youth in the AFSP\'s blog: https://bit.ly/thrivingwithpride', 100)
        .add('LGBTQIA+ Mental Health Resources: https://bit.ly/LGBTMHC', 100);
}
