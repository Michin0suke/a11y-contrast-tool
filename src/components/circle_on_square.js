const CircleOnSquare = ({ txt, circleColor, squareColor, a11y }) => (
    <div style={{
        position: 'relative',
        display: 'flex',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: squareColor,
    }}>
        <div style={{
            width: '100%',
            paddingBottom: '100%',
        }}/>
        <div style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            backgroundColor: circleColor,
            borderRadius: '9999px',
        }}/>
        <span style={{
            position: 'absolute',
            color: squareColor,
            fontSize: 30,
        }}>{a11y}</span>
        <span style={{
            position: 'absolute',
            bottom: 2,
            right: 7,
            fontSize: 20,
            color: circleColor,
        }}>{txt}</span>
    </div>
)

export default CircleOnSquare;