using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SongbookProject.Data;
using SongbookProject.Model.ViewModels;
using SongbookProject.Services;

namespace SongbookProject.API.Controllers
{
    public class SongsController : Controller
    {
        private readonly SongbookDbContext _context;
        private readonly ISongsService _service;

        public SongsController(SongbookDbContext context, ISongsService service)
        {
            _context = context;
            _service = service;
        }

        [Route("/[controller]")]
        public IEnumerable<object> Get()
        {
            var language = Request.Headers["Accept-Language"];
            var songs = _context.Songs.OrderByDescending(song => song.Title).Include("Language").Where(s => s.Language.Code.Equals(language));
            var songsToSend = new List<object>();

            return songs.ToList();
        }

        [HttpPost]
        [Authorize(Roles = "Admin, Editor")]
        [Route("/[controller]/add")]
        public IActionResult AddSong([FromBody]SongViewModel viewModel)
        {
            if (viewModel.Validate(_context))
            {
                var song = _service.AddSong(viewModel);
                if (song != null)
                {
                    return Ok(song);
                }
            }

            return BadRequest();
        }

        [HttpPut]
        [Authorize(Roles = "Admin, Editor")]
        [Route("/[controller]/modify/{id}")]
        public IActionResult ModifySong(int id, [FromBody]SongViewModel viewModel)
        {
            viewModel.Id = id;
            var modifiedSong = _service.ModifySong(viewModel);
            if (modifiedSong != null)
            {
                return Ok(modifiedSong);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        [Authorize(Roles = "Admin, Editor")]
        [Route("/[controller]/delete/{id}")]
        public IActionResult DeleteSong(int id)
        {
            if (_service.DeleteSong(id))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}