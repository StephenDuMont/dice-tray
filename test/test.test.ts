import DiceTray, { Die } from "../dist/dice";

describe.each([
    {
        roll: "2d10", 
        match: /^roll \[\d+( \+ \d+){1}\]$/mg, 
        matchAdv: /^advantageRoll \[\d+( \+ \d+){1}\]$/mg,
        matchDiss: /^disadvantageRoll \[\d+( \+ \d+){1}\]$/mg
    },
    {
        roll: "2d10+5", 
        match: /^roll \[\d+( \+ \d+){2}\]$/mg, 
        matchAdv: /^advantageRoll \[\d+( \+ \d+){2}\]$/mg,
        matchDiss: /^disadvantageRoll \[\d+( \+ \d+){2}\]$/mg
    },
    {
        roll: "2d20 + 2d4 + 6", 
        match: /^roll \[\d+( \+ \d+){4}\]$/mg, 
        matchAdv: /^advantageRoll \[(\[\d+, \d+\] \+ ){2}(\d+ \+ ){2}\d+\]$/gm,
        matchDiss: /^disadvantageRoll \[(\[\d+, \d+\] \+ ){2}(\d+ \+ ){2}\d+\]$/gm 
    }
])('$roll ',  ({roll, match, matchAdv, matchDiss}) => {
    it(`count streight`, () => {
        const d = new DiceTray(roll);
        console.log(d.roll());
        expect(d.roll().details).toMatch(match)
    })
    it(`count adv`, () => {
        const d = new DiceTray(roll);
        console.log(d.advantageRoll());
        expect(d.advantageRoll().details).toMatch(matchAdv)
    })
    it(`count dis`, () => {
        const d = new DiceTray(roll);
        console.log(d.disadvantageRoll());
        expect(d.disadvantageRoll().details).toMatch(matchDiss)
    })


})
describe.skip.each([{base:20}])('roll $base', ({base}) => {

    it(`roll`, () => {
        let d = new Die(base); 
        expect(d.roll()).toBeLessThan(base + 1);
    })
})
describe.each([
    {value: 5},
    {value: 0},
    {value: 10}
])(`constant: $value`, ({value}) => {
    it(`streight`, () => {
        const d = new Die(0, value);
        expect(d.roll().sum).toBe(value);
    })
    it(`advantaged`, () => {
        const d = new Die(0, value);
        expect(d.advantageRoll().sum).toBe(value);
    })
    it(`disadvantaged`, () => {
        const d = new Die(0, value);
        expect(d.disadvantageRoll().sum).toBe(value);
    })
})