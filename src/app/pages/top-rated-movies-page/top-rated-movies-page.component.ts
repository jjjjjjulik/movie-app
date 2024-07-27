import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie/movie.service';
import { takeUntil } from 'rxjs';
import { ClearObservable } from '../../models/clear-observable';

@Component({
  selector: 'app-top-rated-movies-page',
  standalone: true,
  templateUrl: './top-rated-movies-page.component.html',
  styleUrl: './top-rated-movies-page.component.scss',
  imports: [RouterModule, MovieListComponent],
})
export class TopRatedMoviesPageComponent extends ClearObservable implements OnInit {
  topRatedMovies: Movie[] = [];

  constructor(private movieService: MovieService) {
    super();
  }

  ngOnInit() {
    this.movieService.getTopRatedMovies().pipe(takeUntil(this.destroy$)).subscribe(data =>  {
      this.topRatedMovies = data.results;
    });
  }
}
