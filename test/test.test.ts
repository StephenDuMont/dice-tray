import DiceTray, { die } from "../dist/dice";

describe.each([
    {roll: "2d10", match: /^\[\d+( \+ \d+){1}\]$/mg},
    {roll: "2d10+5", match: /^\[\d+( \+ \d+){2}\]$/mg},
    {roll: "2d20 + 2d4 + 6", match: /^\[\d+( \+ \d+){4}\]$/mg}
])('$roll ',  ({roll, match}) => {
    it(`count streight`, () => {
        const d = new DiceTray(roll);
        console.log(d.roll());
        expect(d.roll().details).toMatch(match)
    })
    it(`count adv`, () => {
        const d = new DiceTray(roll);
        console.log(d.advantageRoll());
        expect(d.roll().details).toMatch(match)
    })
    it(`count dis`, () => {
        const d = new DiceTray(roll);
        console.log(d.disadvantageRoll());
        expect(d.roll().details).toMatch(match)
    })


})
describe.skip.each([{base:20}])('roll $base', ({base}) => {

    it(`roll`, () => {
        let d = new die(base); 
        expect(d.roll()).toBeLessThan(base + 1);
    })
})
describe.each([
    {value: 5},
    {value: 0},
    {value: 10}
])(`constant: $value`, ({value}) => {
    it(`streight`, () => {
        const d = new die(0, value);
        expect(d.roll()).toBe(value);
    })
    it(`advantaged`, () => {
        const d = new die(0, value);
        expect(d.advantageRoll()).toBe(value);
    })
    it(`disadvantaged`, () => {
        const d = new die(0, value);
        expect(d.disadvantageRoll()).toBe(value);
    })
})