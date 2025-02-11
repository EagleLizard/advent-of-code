const std = @import("std");

// 2196996 - correct
pub fn day1Part1(inputLines: [][]const u8) i32 {
    const allocator = std.heap.page_allocator;
    const day1Input = parseInput(allocator, inputLines) catch |err| {
        std.debug.print("Error: {}\n", .{err});
        return -1;
    };
    std.mem.sort(i32, day1Input.left_nums, {}, std.sort.asc(i32));
    std.mem.sort(i32, day1Input.right_nums, {}, std.sort.asc(i32));
    var diff_sum: i32 = 0;
    for (day1Input.left_nums, 0..) |l_num, i| {
        const r_num = day1Input.right_nums[i];
        const diff = @abs(r_num - l_num);
        diff_sum += @intCast(diff);
    }
    return diff_sum;
}

const Day1Input = struct {
    left_nums: []i32,
    right_nums: []i32,
};

fn parseInput(allocator: std.mem.Allocator, input_lines: [][]const u8) !Day1Input {
    var left_nums = std.ArrayList(i32).init(allocator);
    defer left_nums.deinit();

    var right_nums = std.ArrayList(i32).init(allocator);
    defer right_nums.deinit();

    for (input_lines) |input_line| {
        var digit_stack = std.ArrayList(u8).init(allocator);
        defer digit_stack.deinit();

        for (input_line) |char| {
            if (isDigit(char)) {
                try digit_stack.append(char);
            } else if (digit_stack.items.len > 0) {
                const digits = try digit_stack.toOwnedSlice();
                const left_num = try std.fmt.parseInt(i32, digits, 10);
                try left_nums.append(left_num);
            }
        }
        if (digit_stack.items.len > 0) {
            const digits = try digit_stack.toOwnedSlice();
            const right_num = try std.fmt.parseInt(i32, digits, 10);
            try right_nums.append(right_num);
        }
    }
    const left = try left_nums.toOwnedSlice();
    const right = try right_nums.toOwnedSlice();
    const res = Day1Input{
        .left_nums = left,
        .right_nums = right,
    };
    return res;
}

fn isDigit(char: u8) bool {
    return char >= 48 and char <= 57;
}
