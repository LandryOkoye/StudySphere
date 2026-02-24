// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StudySphereVerification {
    // Event emitted when a score is logged
    event ScoreLogged(
        address indexed student,
        string environmentId,
        uint8 score,
        uint256 timestamp
    );

    // Structure to store a quiz attempt
    struct QuizAttempt {
        string environmentId;
        uint8 score;
        uint256 timestamp;
    }

    // Mapping from student address to their quiz attempts
    mapping(address => QuizAttempt[]) public studentScores;

    /**
     * @dev Records a quiz score for the calling student.
     * @param environmentId The ID or Hash of the StudySphere environment
     * @param score The score achieved on the quiz (out of 100 or number of questions)
     */
    function recordQuizScore(string memory environmentId, uint8 score) public {
        QuizAttempt memory newAttempt = QuizAttempt({
            environmentId: environmentId,
            score: score,
            timestamp: block.timestamp
        });

        studentScores[msg.sender].push(newAttempt);

        emit ScoreLogged(msg.sender, environmentId, score, block.timestamp);
    }

    /**
     * @dev Retrieves all quiz attempts for a specific student.
     * @param student The address of the student
     */
    function getStudentScores(address student) public view returns (QuizAttempt[] memory) {
        return studentScores[student];
    }
}
